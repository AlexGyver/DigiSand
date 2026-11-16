// DigiSand PCB v2 simulator core: a real ATmega328P (avr8js) running the compiled firmware,
// wired the way the KiCad board is wired. Works in the browser and in Node (for tests).
import {
  CPU, avrInstruction, AVRTimer, timer0Config, timer1Config, timer2Config,
  AVRIOPort, portBConfig, portCConfig, portDConfig, PinState,
  AVRADC, adcConfig, AVRUSART, usart0Config, AVRTWI, twiConfig, AVREEPROM, EEPROMMemoryBackend, AVRClock, clockConfig,
} from 'avr8js';

export const F_CPU = 8_000_000;

// Arduino pin -> [port, bit]
const PIN = (n) => (n < 8 ? ['D', n] : n < 14 ? ['B', n - 8] : ['C', n - 14]);

export function parseHex(text) {
  const prog = new Uint8Array(0x8000);
  let base = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith(':')) continue;
    const n = parseInt(line.substr(1, 2), 16), addr = parseInt(line.substr(3, 4), 16), type = parseInt(line.substr(7, 2), 16);
    if (type === 0) for (let i = 0; i < n; i++) prog[base + addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
    else if (type === 2) base = parseInt(line.substr(9, 4), 16) << 4;
    else if (type === 4) base = parseInt(line.substr(9, 4), 16) << 16;
  }
  return new Uint16Array(prog.buffer);
}

// ---------------------------------------------------------------- MAX7219 daisy chain (software SPI)
export class Max7219Chain {
  constructor(count) {
    this.count = count;
    this.shift = [];                       // bits shifted in since CS went low
    this.chips = Array.from({ length: count }, () => ({
      rows: new Uint8Array(8), intensity: 0, shutdown: true, scanLimit: 7, decode: 0, test: false,
    }));
    this.frames = 0;
  }
  clockBit(bit) { this.shift.push(bit); }
  latch() {
    // last 16 bits went into the chip nearest DIN (chip 0), the 16 before that into chip 1, ...
    const bits = this.shift; this.shift = [];
    for (let c = 0; c < this.count; c++) {
      const end = bits.length - 16 * c;
      if (end < 16) break;
      let w = 0;
      for (let i = end - 16; i < end; i++) w = (w << 1) | bits[i];
      const reg = (w >> 8) & 0x0f, val = w & 0xff, ch = this.chips[c];
      if (reg >= 1 && reg <= 8) ch.rows[reg - 1] = val;
      else if (reg === 0x9) ch.decode = val;
      else if (reg === 0xa) ch.intensity = val & 0x0f;
      else if (reg === 0xb) ch.scanLimit = val & 7;
      else if (reg === 0xc) ch.shutdown = !(val & 1);
      else if (reg === 0xf) ch.test = !!(val & 1);
    }
    this.frames++;
  }
  // LED state as seen by an observer: shutdown/test/scan-limit applied
  lit(chip, row, col) {
    const ch = this.chips[chip];
    if (ch.test) return true;
    if (ch.shutdown || row > ch.scanLimit) return false;
    return !!(ch.rows[row] & (0x80 >> col));
  }
}

// ---------------------------------------------------------------- LSM6DS3 accelerometer (I2C slave 0x6A)
export class LSM6DS3 {
  constructor() {
    this.addr = 0x6a;
    this.regs = new Uint8Array(128);
    this.regs[0x0f] = 0x6A;               // WHO_AM_I (LSM6DS3TR-C)
    this.regs[0x12] = 0x04;               // CTRL3_C reset value: IF_INC=1
    this.ptr = 0; this.firstWrite = false;
    this.setAccel(0, 0, 1);
    this.reads = 0;
  }
  setAccel(x, y, z) {                      // in g, sensor axes
    const put = (r, g) => {
      const v = Math.max(-32768, Math.min(32767, Math.round(g * 16393)));
      this.regs[r] = v & 0xff; this.regs[r + 1] = (v >> 8) & 0xff;
    };
    put(0x28, x); put(0x2a, y); put(0x2c, z);
  }
  get running() { return (this.regs[0x10] & 0xf0) !== 0; } // CTRL1_XL ODR != power-down
  begin() { this.firstWrite = true; }
  write(v) {
    if (this.firstWrite) { this.ptr = v & 0x7f; this.firstWrite = false; return; }
    if (this.ptr !== 0x0f) this.regs[this.ptr] = v;
    if (this.regs[0x12] & 0x04) this.ptr = (this.ptr + 1) & 0x7f;
  }
  read() {
    let v = this.regs[this.ptr];
    if (this.ptr >= 0x28 && this.ptr <= 0x2d && !this.running) v = 0; // powered-down sensor reads 0
    if (this.ptr === 0x28) this.reads++;
    if (this.regs[0x12] & 0x04) this.ptr = (this.ptr + 1) & 0x7f;
    return v;
  }
}

class I2CBus {
  constructor(twi, devices) { this.twi = twi; this.devices = devices; this.dev = null; this.log = { acks: 0, nacks: 0, lastNack: null }; }
  start() { this.twi.completeStart(); }
  stop() { this.dev = null; this.twi.completeStop(); }
  connectToSlave(addr, write) {
    this.dev = this.devices.find((d) => d.addr === addr) || null;
    if (this.dev) { this.log.acks++; if (write) this.dev.begin(); } else { this.log.nacks++; this.log.lastNack = addr; }
    this.twi.completeConnect(!!this.dev);
  }
  writeByte(v) { if (this.dev) this.dev.write(v); this.twi.completeWrite(!!this.dev); }
  readByte() { this.twi.completeRead(this.dev ? this.dev.read() : 0xff); }
}

// ---------------------------------------------------------------- the board
export const DEFAULT_WIRING = { CS: 7, DIN: 8, CLK: 6, SPEAKER: 9, BTN_UP: 2, BTN_MENU: 3, BTN_DOWN: 4 };

export class Board {
  constructor(hexText, { wiring = DEFAULT_WIRING, eeprom = null } = {}) {
    this.cpu = new CPU(parseHex(hexText));
    const cpu = this.cpu;
    this.timers = [new AVRTimer(cpu, timer0Config), new AVRTimer(cpu, timer1Config), new AVRTimer(cpu, timer2Config)];
    this.clock = new AVRClock(cpu, F_CPU, clockConfig);
    this.port = { B: new AVRIOPort(cpu, portBConfig), C: new AVRIOPort(cpu, portCConfig), D: new AVRIOPort(cpu, portDConfig) };
    // ADC: the processor runs from the 3.3 V regulator (AVCC = 3.3 V)
    this.adc = new AVRADC(cpu, adcConfig);
    this.adc.avcc = 3.3;
    this.adc.channelValues[7] = 3.8 / 11;   // battery divider R14/R15 on ADC7
    this.usart = new AVRUSART(cpu, usart0Config, F_CPU);
    this.serial = '';
    this.usart.onByteTransmit = (b) => { this.serial += String.fromCharCode(b); if (this.serial.length > 20000) this.serial = this.serial.slice(-10000); };
    this.eepromBackend = new EEPROMMemoryBackend(1024);
    if (eeprom) this.eepromBackend.memory.set(eeprom);
    this.eeprom = new AVREEPROM(cpu, this.eepromBackend);
    this.twi = new AVRTWI(cpu, twiConfig, F_CPU);
    this.accel = new LSM6DS3();
    this.i2c = new I2CBus(this.twi, [this.accel]);
    this.twi.eventHandler = this.i2c;
    this.matrix = new Max7219Chain(2);
    this.wiring = { ...wiring };
    this.activity = { CS: 0, DIN: 0, CLK: 0, SDA: 0, SPK: 0 };

    // MAX7219 lines: sample DIN on CLK rising edge, latch on CS rising edge
    const [csP, csB] = PIN(this.wiring.CS), [ckP, ckB] = PIN(this.wiring.CLK), [dP, dB] = PIN(this.wiring.DIN);
    const level = (p, b) => this.port[p].pinState(b) === PinState.High;
    let lastCK = false, lastCS = true;
    const onChange = () => {
      const ck = level(ckP, ckB), cs = level(csP, csB);
      if (ck && !lastCK && !cs) { this.matrix.clockBit(level(dP, dB) ? 1 : 0); this.activity.CLK++; }
      if (cs && !lastCS) { this.matrix.latch(); this.activity.CS++; }
      lastCK = ck; lastCS = cs;
    };
    for (const p of new Set([csP, ckP, dP])) this.port[p].addListener(onChange);

    // speaker: measure toggle rate of the speaker pin
    const [sP, sB] = PIN(this.wiring.SPEAKER);
    this.speaker = { lastToggle: 0, period: 0, edges: 0 };
    let lastSpk = false;
    this.port[sP].addListener(() => {
      const v = level(sP, sB);
      if (v !== lastSpk) {
        const now = cpu.cycles, s = this.speaker;
        if (v) { if (s.lastRise) s.period = now - s.lastRise; s.lastRise = now; }
        s.lastToggle = now; s.edges++; this.activity.SPK++;
      }
      lastSpk = v;
    });

    // buttons idle high (pull-ups); pressed = connected to GND
    this.buttons = {};
    for (const k of ['BTN_UP', 'BTN_MENU', 'BTN_DOWN']) { const [p, b] = PIN(this.wiring[k]); this.port[p].setPin(b, true); this.buttons[k] = false; }
    // I2C lines are open-drain with pull-ups (R10/R11)
    this.port.C.setPin(4, true); this.port.C.setPin(5, true);
  }

  setBatteryVoltage(v) { this.adc.channelValues[7] = v / 11; }

  press(name, down) { const [p, b] = PIN(this.wiring[name]); this.port[p].setPin(b, !down); this.buttons[name] = down; }

  // tone currently on the speaker pin (Hz) or 0
  get toneHz() {
    const s = this.speaker;
    if (!s.period || this.cpu.cycles - s.lastToggle > F_CPU * 0.02) return 0;
    return F_CPU / s.period;
  }

  run(cycles) {
    const cpu = this.cpu, end = cpu.cycles + cycles;
    while (cpu.cycles < end) { avrInstruction(cpu); cpu.tick(); }
  }
  get seconds() { return this.cpu.cycles / F_CPU; }
}

// Firmware frame (what DigiSand calls X/Y/Z after setMpuOrientation(ROT_X_CW_90)):
//   fX = -rawY, fY = +rawX, fZ = -rawZ   =>   rawX = fY, rawY = -fX, rawZ = -fZ
// The clock is rotated by `roll` degrees in its display plane and leaned back by `lean` degrees.
export function gravityForPose(rollDeg, leanDeg) {
  const r = (rollDeg * Math.PI) / 180, l = (leanDeg * Math.PI) / 180;
  const fX = -Math.sin(r) * Math.cos(l), fY = Math.cos(r) * Math.cos(l), fZ = Math.sin(l);
  return { x: fY, y: -fX, z: -fZ };
}
