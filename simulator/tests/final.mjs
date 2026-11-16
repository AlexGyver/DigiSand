import fs from 'fs';
import { Board, gravityForPose } from '../src/board.js';
const hex = fs.readFileSync('fw/DigiSand2_PCB.hex', 'utf8');
const show = (b) => { let s=''; for (let r = 7; r >= 0; r--) { for (let c = 0; c < 2; c++) { for (let k = 0; k < 8; k++) s += (b.matrix.chips[c].rows[r] >> k) & 1 ? '#' : '.'; s += '  '; } s += '\n'; } return s; };
const count = (b,c) => { let n=0; for (const r of b.matrix.chips[c].rows) for (let k=0;k<8;k++) n += (r>>k)&1; return n; };
function mk(v) { const b = new Board(hex); const g = gravityForPose(0,0); b.accel.setAccel(g.x,g.y,g.z); b.setBatteryVoltage(v); return b; }
// 1 normal run
let b = mk(3.9); b.run(8e6*70); console.log('1. battery 3.9 V, 70 s: sensor reads', b.accel.reads, 'i2c nacks', b.i2c.log.nacks, '| grains bottom', count(b,1), 'top', count(b,0), '| serial', JSON.stringify(b.serial));
// 2 buttons
b = mk(3.9); b.run(8e6*3.5); b.press('BTN_UP',true); b.run(8e6*0.1); b.press('BTN_UP',false); b.run(8e6*0.4); console.log('2. after Up click (expect 01:01):\n'+show(b));
b.run(8e6*4); b.press('BTN_MENU',true); b.run(8e6*1.2); b.press('BTN_MENU',false); b.run(8e6*0.3); console.log('   after Menu hold (expect brightness icon + 01):\n'+show(b));
// 3 flip
b = mk(3.9); b.run(8e6*20); const t0=count(b,1); let g=gravityForPose(180,0); b.accel.setAccel(g.x,g.y,g.z); b.run(8e6*20); console.log('3. flip: bottom matrix had', t0, 'grains after 20 s; 20 s after flipping it has', count(b,1));
// 4 no battery / battery edge cases at power-on
for (const v of [0, 2.9, 3.05, 3.3, 4.2, 4.4]) { b = mk(v); b.run(8e6*12); console.log(`4. power-on with ${v} V on battery pin -> after 12 s: sand running=${b.accel.reads>0}, top-left screen:`, b.accel.reads>0?'hourglass':'EMPTY-BATTERY ICON (still showing)'); }
// 5 EEPROM persistence
b = mk(3.9); b.run(8e6*3.5); for (let i=0;i<3;i++){ b.press('BTN_UP',true); b.run(8e6*0.1); b.press('BTN_UP',false); b.run(8e6*0.4);} b.run(8e6*12); const ee=b.eepromBackend.memory.slice();
const b2 = new Board(hex,{eeprom:ee}); b2.setBatteryVoltage(3.9); b2.run(8e6*3); console.log('5. settings kept after power cycle (expect 01:03):\n'+show(b2));
// 6 timing: millis accuracy at 8 MHz -> time for 58 grains at 60 s setting
