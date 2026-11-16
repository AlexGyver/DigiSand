import { Board, gravityForPose, F_CPU, DEFAULT_WIRING } from './board.js';
import { PowerModel, clockLoadA, ocv } from './power.js';
import HEX_PORTED from '../fw/DigiSand2_PCB.hex';
import HEX_ORIGINAL from '../fw/DigiSand2_original.hex';
import PARTS from '../parts.json';

const $ = (s) => document.querySelector(s);
let board, eepromSaved = null, firmwareName = 'ported', customHex = null;
let roll = 0, lean = 0, speed = 1, running = true;
let wiring = { ...DEFAULT_WIRING };
const power = new PowerModel();
let battSpeed = 300, wasPowered = true;

// ------------------------------------------------------------------ firmware / reset
function hexFor(name) { return name === 'ported' ? HEX_PORTED : name === 'original' ? HEX_ORIGINAL : customHex; }
function reset(keepEeprom = true) {
  if (board && keepEeprom) eepromSaved = board.eepromBackend.memory.slice();
  board = new Board(hexFor(firmwareName), { wiring, eeprom: keepEeprom ? eepromSaved : null });
  applyPose();
  board.setBatteryVoltage(power.vbat);
  $('#serial').textContent = '';
  lastSerialLen = 0;
}
function applyPose() { const g = gravityForPose(roll, lean); board.accel.setAccel(g.x, g.y, g.z); }

// ------------------------------------------------------------------ clock drawing
const cv = $('#clock'), ctx = cv.getContext('2d');
function drawClock() {
  const W = cv.width, H = cv.height, s = W / 520;
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate((roll * Math.PI) / 180);
  const lk = Math.cos((lean * Math.PI) / 180);
  ctx.scale(1, 0.35 + 0.65 * lk);
  // case
  ctx.fillStyle = '#1b1d22'; ctx.strokeStyle = '#3a3f4a'; ctx.lineWidth = 3 * s;
  roundRect(-150 * s, -232 * s, 300 * s, 464 * s, 46 * s); ctx.fill(); ctx.stroke();
  // two 8x8 matrices as an hourglass: sand-box (x,y) rotated 45 deg so (0,0) is top, (15,15) bottom
  const pitch = 18.5 * s, r = 6.6 * s;
  ctx.rotate(Math.PI / 4);
  ctx.translate(-7.5 * pitch, -7.5 * pitch);
  const m = board.matrix;
  for (let chip = 0; chip < 2; chip++) {
    const ch = m.chips[chip];
    // panel background
    ctx.fillStyle = '#0b0b0d';
    ctx.fillRect((chip * 8 - 0.5) * pitch, (chip * 8 - 0.5) * pitch, 8 * pitch, 8 * pitch);
    const on = power.mcuPowered && (!ch.shutdown || ch.test);
    const alpha = (0.35 + 0.65 * ((ch.test ? 15 : ch.intensity) / 15)) * (0.25 + 0.75 * power.matrixFactor);
    for (let row = 0; row < 8; row++) for (let bit = 0; bit < 8; bit++) {
      const lit = on && (ch.test || (row <= ch.scanLimit && ((ch.rows[row] >> bit) & 1)));
      const x = chip * 8 + bit, y = chip * 8 + (7 - row);  // firmware drawing coordinates -> sand box
      ctx.beginPath(); ctx.arc(x * pitch, y * pitch, r, 0, Math.PI * 2);
      if (lit) { ctx.fillStyle = `rgba(255,60,40,${alpha})`; ctx.shadowColor = 'rgba(255,40,20,0.9)'; ctx.shadowBlur = 10 * s * alpha; }
      else { ctx.fillStyle = '#2a1512'; ctx.shadowBlur = 0; }
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;
  ctx.restore();
  // gravity arrow (always straight down on screen)
  ctx.fillStyle = '#8a93a6'; ctx.font = `${13 * s}px system-ui`; ctx.textAlign = 'right';
  ctx.fillText('gravity ↓', W - 10 * s, H - 12 * s);
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// drag to rotate the clock
let drag = null;
cv.addEventListener('pointerdown', (e) => { drag = { a: angleAt(e), roll }; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', (e) => { if (!drag) return; setRoll(drag.roll + angleAt(e) - drag.a); });
cv.addEventListener('pointerup', () => (drag = null));
function angleAt(e) { const b = cv.getBoundingClientRect(); return (Math.atan2(e.clientY - b.top - b.height / 2, e.clientX - b.left - b.width / 2) * 180) / Math.PI; }
function setRoll(v) { roll = ((v % 360) + 540) % 360 - 180; $('#roll').value = roll; $('#rollv').textContent = Math.round(roll) + '°'; applyPose(); }
function setLean(v) { lean = v; $('#lean').value = v; $('#leanv').textContent = Math.round(v) + '°'; applyPose(); }
$('#roll').oninput = (e) => setRoll(+e.target.value);
$('#lean').oninput = (e) => setLean(+e.target.value);
document.querySelectorAll('[data-roll]').forEach((b) => (b.onclick = () => { setRoll(+b.dataset.roll); if (b.dataset.lean) setLean(+b.dataset.lean); }));

// ------------------------------------------------------------------ buttons (mouse, touch, keyboard)
const keys = { BTN_UP: 'ArrowUp', BTN_MENU: 'Space', BTN_DOWN: 'ArrowDown' };
document.querySelectorAll('[data-btn]').forEach((el) => {
  const name = el.dataset.btn;
  const down = (e) => { e.preventDefault(); board.press(name, true); el.classList.add('down'); audioInit(); };
  const up = () => { board.press(name, false); el.classList.remove('down'); };
  el.addEventListener('pointerdown', down); el.addEventListener('pointerup', up); el.addEventListener('pointerleave', () => board.buttons[name] && up());
});
window.addEventListener('keydown', (e) => { for (const [n, k] of Object.entries(keys)) if (e.code === k && !e.repeat) { board.press(n, true); document.querySelector(`[data-btn=${n}]`).classList.add('down'); e.preventDefault(); } });
window.addEventListener('keyup', (e) => { for (const [n, k] of Object.entries(keys)) if (e.code === k) { board.press(n, false); document.querySelector(`[data-btn=${n}]`).classList.remove('down'); } });

// ------------------------------------------------------------------ sound
let audio = null, osc = null, gain = null, muted = false;
function audioInit() {
  if (audio) return;
  try {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    osc = audio.createOscillator(); osc.type = 'square'; gain = audio.createGain(); gain.gain.value = 0;
    osc.connect(gain).connect(audio.destination); osc.start();
  } catch (e) { audio = null; }
}
window.addEventListener('pointerdown', audioInit, { once: true });
$('#mute').onclick = () => { muted = !muted; $('#mute').textContent = muted ? 'Sound: off' : 'Sound: on'; };
function updateSound(hz) {
  if (!audio) return;
  const t = audio.currentTime;
  if (hz > 20 && !muted) { osc.frequency.setTargetAtTime(hz, t, 0.002); gain.gain.setTargetAtTime(0.05, t, 0.004); }
  else gain.gain.setTargetAtTime(0, t, 0.004);
}

// ------------------------------------------------------------------ firmware & wiring controls
$('#fw').onchange = (e) => {
  if (e.target.value === 'custom') { $('#hexfile').click(); return; }
  firmwareName = e.target.value; reset(false);
};
$('#hexfile').onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  customHex = await f.text(); firmwareName = 'custom';
  const opt = $('#fw option[value=custom]'); opt.textContent = 'Your file: ' + f.name; $('#fw').value = 'custom';
  reset(false);
};
$('#reset').onclick = () => reset(true);
$('#erase').onclick = () => { eepromSaved = null; reset(false); };
$('#pause').onclick = () => { running = !running; $('#pause').textContent = running ? 'Pause' : 'Run'; };
$('#speed').onchange = (e) => (speed = +e.target.value);
$('#j4').onchange = (e) => {
  const names = e.target.value.split(','), pins = [6, 7, 8];
  names.forEach((n, i) => (wiring[n] = pins[i]));
  reset(true);
};

// ------------------------------------------------------------------ board view hotspots
const INFO = {
  U1: ['ATmega328P', 'The processor. Runs the firmware you see here at 8 MHz from crystal Y1.'],
  U6: ['LSM6DS3 motion sensor', 'Tells the firmware which way is down (I2C address 0x6A). Tilt the clock to change it.'],
  U2: ['BQ24072 charger', 'Charges the LiPo from USB-C to 4.2 V (v2.1 replaces the BQ24078, which charged to an unsafe 4.35 V). Simulated in the Power panel.'],
  U7: ['TLV75733 regulator', 'Makes the 3.3 V the processor and sensor run on.'],
  Q1: ['AO3401A power switch', 'New in v2. The POWER slide switch turns this transistor on or off.'],
  SW1: ['POWER slide switch', 'New behaviour in v2: really turns the clock off; charging still works.'],
  J1: ['USB-C', 'Charging and programming (through the CH340N).'],
  U4: ['CH340N USB chip', 'Lets the Arduino IDE upload firmware over USB-C. Serial output is shown below.'],
  Y1: ['8 MHz crystal', 'Sets the processor speed. Changed from 16 MHz in v2.'],
  D2: ['Green LED', 'PGOOD: lights while USB power is present.'],
  D3: ['Red LED', 'CHG: lights while the battery is charging, goes out when full.'],
  R14: ['Battery sense 1M', 'New in v2.1. With R15 (100k) it feeds battery voltage / 11 to ADC7.'],
  SW2: ['RESET button', 'Restarts the processor (same as the Reset button above).'],
  R13: ['Speaker resistor', 'New in v2. Protects pin D9 from the speaker current.'],
  J101: ['ISP header (bottom)', 'Used once with a USBasp to load the bootloader.'],
  J3: ['BUTTONS connector, JST SUR 0.8 mm (bottom)', 'Pin 1 D2 Up, 2 D3 Menu, 3 D4 Down, 4 speaker (D9 via R13), 5 GND.'],
  J4: ['MATRIX connector, JST SUR 0.8 mm (bottom)', 'Pin 1 D6, 2 D7, 3 D8 to the two MAX7219 matrices, 4 battery power (switched), 5 GND.'],
  J2: ['BATTERY connector, JST SUR 0.8 mm (bottom)', ' Pin 1 = battery +, pin 2 = GND. Check your battery plug polarity.'],
};
const bv = $('#boardview');
const toPx = (x, y) => [((10 + (x - 150) * (1157 / 32)) * 100) / 1177, ((10 + (y - 68) * (1157 / 32)) * 100) / 1177];
for (const [ref, [name, text]] of Object.entries(INFO)) {
  const p = PARTS[ref]; if (!p) continue;
  const [x, y] = toPx(p[0], p[1]);
  const d = document.createElement('button'); d.className = 'hot' + (p[2] === 'B.Cu' ? ' bottom' : ''); d.style.left = x + '%'; d.style.top = y + '%';
  d.title = name; d.textContent = ref; d.id = 'hot-' + ref;
  d.onclick = () => { $('#partinfo').innerHTML = `<b>${ref}: ${name}</b><br>${text}`; };
  bv.appendChild(d);
}

// ------------------------------------------------------------------ live signals panel
let lastAct = {}, lastSerialLen = 0, lastWall = performance.now(), simAcc = 0, wallAcc = 0, rate = 0;
function updatePanel(dtWall) {
  const a = board.activity, led = (id, v) => $(id).classList.toggle('on', v);
  led('#s-clk', a.CLK !== lastAct.CLK); led('#s-cs', a.CS !== lastAct.CS); led('#s-din', a.CLK !== lastAct.CLK);
  led('#s-i2c', board.accel.reads !== lastAct.reads); led('#s-spk', board.toneHz > 0);
  led('#s-up', board.buttons.BTN_UP); led('#s-menu', board.buttons.BTN_MENU); led('#s-down', board.buttons.BTN_DOWN);
  lastAct = { ...a, reads: board.accel.reads };
  $('#t-sim').textContent = board.seconds.toFixed(1) + ' s';
  $('#t-rate').textContent = Math.round(rate * 100) + '% of real time';
  const log = board.i2c.log;
  $('#t-i2c').textContent = log.nacks && !log.acks ? `no answer at 0x${(log.lastNack || 0).toString(16)}` : `${board.accel.reads} reads, OK`;
  $('#t-tone').textContent = board.toneHz ? Math.round(board.toneHz) + ' Hz' : 'silent';
  const ch = board.matrix.chips;
  $('#t-mx').textContent = board.matrix.frames ? `${board.matrix.frames} updates, brightness ${ch[0].intensity}` : 'no data received';
  if (board.serial.length !== lastSerialLen) {
    const el = $('#serial'); el.textContent = board.serial.slice(-3000); el.scrollTop = el.scrollHeight; lastSerialLen = board.serial.length;
  }
}

// ------------------------------------------------------------------ power panel
$('#usb').onclick = () => { power.usb = !power.usb; audioInit(); };
$('#pwr').onclick = () => { power.switchOn = !power.switchOn; audioInit(); };
$('#level').oninput = (e) => { power.setLevel(+e.target.value / 100); };
$('#cap').onchange = (e) => (power.capacity_mAh = +e.target.value);
$('#bspeed').onchange = (e) => (battSpeed = +e.target.value);
function fmtTime(h) { if (!isFinite(h) || h <= 0) return '-'; const m = Math.round(h * 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; }
function updatePower() {
  $('#usb').textContent = power.usb ? 'USB-C: plugged in' : 'USB-C: unplugged';
  $('#usb').classList.toggle('active', power.usb);
  $('#pwr').textContent = power.switchOn ? 'POWER switch: ON' : 'POWER switch: OFF';
  $('#pwr').classList.toggle('active', power.switchOn);
  $('#led-g').classList.toggle('on', power.greenLED); $('#led-r').classList.toggle('on', power.redLED);
  document.getElementById('hot-D2')?.classList.toggle('glow-g', power.greenLED);
  document.getElementById('hot-D3')?.classList.toggle('glow-r', power.redLED);
  const pct = power.percent;
  $('#bfill').style.width = pct + '%'; $('#bfill').style.background = pct < 15 ? '#e5484d' : pct < 35 ? '#f5a524' : '#41d18b';
  $('#bpct').textContent = pct + '%';
  if (document.activeElement !== $('#level')) $('#level').value = Math.max(0, Math.min(100, power.soc * 100));
  $('#p-status').textContent = power.status;
  $('#p-vbat').textContent = power.packCutoff ? 'cut off' : power.vbat.toFixed(2) + ' V';
  const ma = power.ibat * 1000;
  $('#p-ibat').textContent = Math.abs(ma) < 0.5 ? '0 mA' : (ma > 0 ? 'charging +' : 'draining ') + Math.abs(ma).toFixed(0) + ' mA';
  $('#p-load').textContent = (power.isys * 1000).toFixed(0) + ' mA' + (power.usb && power.isys > 0 ? ' (from USB)' : '');
  $('#p-sys').textContent = power.vsys.toFixed(2) + ' V / ' + power.v33.toFixed(2) + ' V';
  $('#p-mcu').textContent = power.mcuPowered ? (power.matrixFactor < 0.95 ? 'running, matrix dimmed' : 'running') : (power.switchOn ? 'stopped (supply too low)' : 'off');
  const remain = power.capacity_mAh / 1000;
  $('#p-time').textContent = power.ibat > 0.001 ? 'full in ' + fmtTime(((1 - power.soc) * remain) / power.ibat * 1.15)
    : power.ibat < -0.001 ? 'empty in ' + fmtTime((Math.max(0, power.soc) * remain) / -power.ibat) : '-';
  $('#p-adc').textContent = power.switchOn ? (power.vbat / 11 * 1000).toFixed(0) + ' mV on ADC7' : '-';
}

// ------------------------------------------------------------------ main loop
let panelTick = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - lastWall) / 1000); lastWall = now;
  if (running) {
    // power: the clock only runs while the 3.3 V rail is above the brown-out level
    power.step(dt * battSpeed, clockLoadA(board.matrix, wasPowered));
    board.setBatteryVoltage(power.switchOn ? power.vbat : 0);
    const powered = power.mcuPowered;
    if (powered && !wasPowered) reset(true);          // power returns: the processor boots again
    wasPowered = powered;
  }
  if (running && wasPowered) {
    const t0 = performance.now();
    const want = Math.round(dt * F_CPU * speed);
    const c0 = board.cpu.cycles;
    board.run(want);
    // keep the page responsive if the computer can't keep up
    const took = (performance.now() - t0) / 1000;
    simAcc += (board.cpu.cycles - c0) / F_CPU; wallAcc += Math.max(dt, took);
    if (wallAcc > 0.5) { rate = simAcc / wallAcc; simAcc = wallAcc = 0; }
  }
  updateSound(wasPowered ? board.toneHz : 0);
  drawClock();
  if (++panelTick % 4 === 0) { updatePanel(dt); updatePower(); }
  requestAnimationFrame(frame);
}
reset(false);
setRoll(0); setLean(0);
requestAnimationFrame(frame);
