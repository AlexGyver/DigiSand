// Power section of the DigiSand PCB v2.1, modelled from datasheets and the board's component values.
// Not a circuit (SPICE) simulation: it reproduces the behaviour of each part.
//   U2 BQ24072 charger: R6 = 3k -> ICHG = 890/3000 = 0.30 A, R3 = 1.8k -> input limit 1610/1800 = 0.89 A,
//      pre-charge below 3.0 V at 10 % ICHG, CV at 4.20 V, done when current < 10 % ICHG, recharge at 4.10 V.
//      OUT = VBAT + 225 mV with USB (clamped to 3.4 V while VBAT < 3.2 V), OUT = VBAT on battery.
//      D2 green = PGOOD (USB present), D3 red = CHG (charging).
//   Q1 AO3401A + SW1: SYS = OUT when the switch is ON, otherwise 0.
//   U7 TLV75733: 3.3 V from SYS, follows SYS when SYS < 3.35 V. ATmega brown-out at 2.7 V.
//   MAX7219 matrices run from SYS; LEDs dim as SYS falls.
//   R14/R15 1M/100k: ADC7 sees VBAT / 11.

const OCV = [ // LiPo open-circuit voltage vs state of charge (typical 1-cell curve)
  [0.00, 3.00], [0.03, 3.30], [0.06, 3.50], [0.10, 3.60], [0.20, 3.69], [0.30, 3.74], [0.40, 3.78],
  [0.50, 3.82], [0.60, 3.87], [0.70, 3.93], [0.80, 4.00], [0.90, 4.08], [1.00, 4.20],
];
export function ocv(soc) {
  if (soc <= 0) return 3.0 + soc * 4;            // below empty the voltage collapses quickly
  if (soc >= 1) return 4.2 + (soc - 1) * 3;      // only reachable when overcharged
  for (let i = 1; i < OCV.length; i++) if (soc <= OCV[i][0]) {
    const [s0, v0] = OCV[i - 1], [s1, v1] = OCV[i];
    return v0 + ((soc - s0) / (s1 - s0)) * (v1 - v0);
  }
  return 4.2;
}
export function socFromVoltage(v) { let lo = -0.2, hi = 1.05; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (ocv(m) < v) lo = m; else hi = m; } return (lo + hi) / 2; }

export class PowerModel {
  constructor() {
    this.capacity_mAh = 500;
    this.rint = 0.15;          // cell + connector resistance, ohm
    this.soc = 0.5;
    this.usb = false;
    this.switchOn = true;
    this.ICHG = 890 / 3000;    // A (R6 = 3k)
    this.ILIM = 1610 / 1800;   // A
    this.VREG = 4.2;
    this.phase = 'idle';       // idle | precharge | fast | taper | done
    this.done = false;
    this.packCutoff = false;   // battery's own protection opens below ~2.8 V
    this.ibat = 0; this.isys = 0; this.iin = 0;
    this.vbat = ocv(this.soc); this.vout = this.vbat; this.vsys = this.vbat; this.v33 = 3.3;
  }
  setLevel(soc) { this.soc = soc; this.done = false; this.packCutoff = false; }

  // dt in (battery) seconds; loadA = current the clock draws from SYS (A) when it is powered
  step(dt, loadA) {
    const o = ocv(this.soc);
    if (this.packCutoff && (this.usb || o > 3.0)) this.packCutoff = false;
    const batOK = !this.packCutoff;
    const sysLoad = this.switchOn ? loadA : 0;
    let ichg = 0, phase = 'idle';
    if (this.usb) {
      // charger: pre-charge / constant current / constant voltage
      if (this.done && o < this.VREG - 0.1) this.done = false;      // recharge threshold
      if (!this.done) {
        const avail = Math.max(0, this.ILIM - sysLoad);            // power path: system first
        if (o < 3.0) { ichg = Math.min(0.1 * this.ICHG, avail); phase = 'precharge'; }
        else {
          const cv = (this.VREG - o) / this.rint;                  // current the CV loop allows
          ichg = Math.max(0, Math.min(this.ICHG, avail, cv));
          phase = cv < this.ICHG ? 'taper' : 'fast';
          if (phase === 'taper' && ichg < 0.1 * this.ICHG) { this.done = true; ichg = 0; }
        }
      }
      if (this.done) phase = 'done';
      this.ibat = ichg;                                            // + into the battery
      this.iin = sysLoad + ichg;
      this.vbat = o + ichg * this.rint;
      this.vout = this.vbat < 3.2 ? Math.max(3.4, this.vbat) : this.vbat + 0.225;
    } else {
      this.iin = 0;
      this.ibat = batOK ? -sysLoad : 0;
      this.vbat = batOK ? o - sysLoad * this.rint : 0;
      this.vout = batOK ? Math.max(0, this.vbat - sysLoad * 0.05) : 0;
      phase = 'battery';
    }
    this.phase = phase;
    this.soc += (this.ibat * dt) / (this.capacity_mAh * 3.6);
    if (this.soc < -0.05) this.soc = -0.05;
    if (!this.usb && ocv(this.soc) < 2.9) this.packCutoff = true;
    this.isys = sysLoad;
    this.vsys = this.switchOn ? Math.max(0, this.vout - sysLoad * 0.06) : 0;    // Q1 on-resistance
    this.v33 = Math.min(3.3, Math.max(0, this.vsys - 0.03 - 0.43 * 0.012));      // LDO dropout at ~12 mA
  }
  get mcuPowered() { return this.v33 >= 2.7; }                                   // brown-out level
  get matrixFactor() { return Math.max(0, Math.min(1, (this.vsys - 2.5) / 1.3)); }
  get greenLED() { return this.usb; }                                            // PGOOD
  get redLED() { return this.usb && ['precharge', 'fast', 'taper'].includes(this.phase); } // CHG
  get percent() { return Math.max(0, Math.min(100, Math.round(this.soc * 100))); }
  get status() {
    if (this.packCutoff) return 'Battery empty (its protection cut off)';
    return { precharge: 'Charging slowly (battery very flat)', fast: 'Charging (0.30 A)', taper: 'Topping off at 4.2 V', done: 'Fully charged', battery: this.switchOn ? 'Running on battery' : 'Off', idle: 'Idle' }[this.phase] || this.phase;
  }
}

// Current the clock draws, calibrated to the README measurements (35 / 60 / 200 mA with the hourglass shown)
export function clockLoadA(matrix, powered) {
  if (!powered) return 0.0002;
  let mA = 9;                                       // ATmega 8 MHz + sensor + CH340N + regulator
  for (const ch of matrix.chips) {
    if (ch.shutdown && !ch.test) { mA += 0.15; continue; }
    mA += 11.5;                                     // MAX7219 operating current
    let lit = 0;
    for (let r = 0; r <= ch.scanLimit; r++) { let v = ch.test ? 0xff : ch.rows[r]; while (v) { lit += v & 1; v >>= 1; } }
    const duty = ch.test ? 1 : (2 * ch.intensity + 1) / 32;
    mA += lit * 2.9 * duty;
  }
  return mA / 1000;
}
