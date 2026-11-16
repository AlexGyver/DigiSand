import fs from 'fs';
import { Board, gravityForPose } from '../src/board.js';
import { PowerModel, clockLoadA } from '../src/power.js';
const hex = fs.readFileSync('fw/DigiSand2_PCB.hex', 'utf8');
function boot(vbat, label) {
  const b = new Board(hex); const g = gravityForPose(0, 0); b.accel.setAccel(g.x, g.y, g.z);
  b.setBatteryVoltage(vbat); b.run(8e6 * 0.4);
  let s = ''; for (let r = 0; r < 8; r++) { for (let c = 0; c < 2; c++) { for (let k = 0; k < 8; k++) s += (b.matrix.chips[c].rows[7 - r] >> k) & 1 ? '#' : '.'; s += '  '; } s += '\n'; }
  console.log(`--- ${label}: battery ${vbat} V`); console.log(s);
}
boot(4.10, 'full'); boot(3.40, 'low'); boot(2.95, 'empty');
// power model: charge from 2% to full with the clock running
const p = new PowerModel(); p.setLevel(0.02); p.usb = true; let t = 0; const log = [];
const fakeMatrix = { chips: [0, 1].map(() => ({ shutdown: false, test: false, scanLimit: 7, intensity: 1, rows: new Uint8Array(8).fill(0xff) })) };
while (!p.done && t < 4 * 3600) { p.step(10, clockLoadA(fakeMatrix, true)); t += 10; if (t % 900 === 0) log.push(`${t / 60}min ${p.phase} ${p.vbat.toFixed(2)}V ${(p.ibat * 1000).toFixed(0)}mA ${p.percent}% red=${p.redLED}`); }
console.log(log.join('\n')); console.log('charged in', (t / 60).toFixed(0), 'min');
p.usb = false; t = 0; while (p.mcuPowered && t < 48 * 3600) { p.step(10, clockLoadA(fakeMatrix, true)); t += 10; }
console.log('runs on battery for', (t / 3600).toFixed(1), 'h at brightness 1 (all LEDs lit worst case), cutoff', p.packCutoff, 'vsys', p.vsys.toFixed(2));
