import fs from 'fs';
import { Board, gravityForPose } from '../src/board.js';
const b = new Board(fs.readFileSync(process.argv[2], 'utf8'));
const pose = (r,l)=>{const g = gravityForPose(r, l); b.accel.setAccel(g.x, g.y, g.z);}; pose(0,0);
const at = (s) => b.run(Math.max(0, Math.round(s * 8e6 - b.cpu.cycles)));
const dump = (title) => { console.log('--- '+title+` t=${b.seconds.toFixed(2)} reads=${b.accel.reads} tone=${b.toneHz.toFixed(0)}`);
  for (let r = 0; r < 8; r++) { let line = ''; for (let c = 0; c < 2; c++) { for (let k = 0; k < 8; k++) line += b.matrix.lit(c, r, k) ? '#' : '.'; line += '  '; } console.log(line); } };
at(0.6);
for (let i = 0; i < 3; i++) { b.press('BTN_UP', true); at(b.seconds + 0.08); b.press('BTN_UP', false); at(b.seconds + 0.25); }
dump('after 3x UP (expect 01:03)');
at(5); dump('sand, upright');
pose(30,0); at(7); dump('tilted 30deg');
pose(180,0); at(10); dump('flipped');
console.log(b.serial);
