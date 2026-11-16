import fs from 'fs';
import { Board, gravityForPose } from '../src/board.js';
const b = new Board(fs.readFileSync(process.argv[2], 'utf8'));
const g = gravityForPose(0, 0); b.accel.setAccel(g.x, g.y, g.z);
const at = (s) => b.run(Math.max(0, Math.round(s * 8e6 - b.cpu.cycles)));
const dump = (t) => { console.log('--- ' + t); for (let r = 0; r < 8; r++) { let line = ''; for (let c = 0; c < 2; c++) { for (let k = 0; k < 8; k++) line += (b.matrix.chips[c].rows[r] >> k) & 1 ? '#' : '.'; line += '  '; } console.log('row' + r + ' ' + line); } };
at(0.6); for (let i = 0; i < 2; i++) { b.press('BTN_DOWN', true); at(b.seconds + 0.08); b.press('BTN_DOWN', false); at(b.seconds + 0.25); }
dump('x = bit (LSB left), expect 00:58'); 
