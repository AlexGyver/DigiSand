import fs from 'fs';
import { Board, gravityForPose } from '../src/board.js';
const b = new Board(fs.readFileSync('fw/DigiSand2_PCB.hex', 'utf8'));
const g = gravityForPose(0, 0); b.accel.setAccel(g.x, g.y, g.z);
const tones = new Set(); let first = null;
for (let i = 0; i < 90 * 50; i++) { b.run(8e6 / 50); const t = b.toneHz; if (t) { tones.add(Math.round(t)); if (first === null) first = b.seconds.toFixed(1); } }
console.log('melody started at', first, 's; notes heard (Hz):', [...tones].slice(0, 15).join(', '));
let bottom = 0; for (const r of b.matrix.chips[1].rows) for (let k = 0; k < 8; k++) bottom += (r >> k) & 1;
console.log('grains in bottom matrix:', bottom);
