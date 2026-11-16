import fs from 'fs';
import { Board, gravityForPose } from '../src/board.js';
const hex = fs.readFileSync(process.argv[2], 'utf8');
const b = new Board(hex);
const g = gravityForPose(0, 0); b.accel.setAccel(g.x, g.y, g.z);
const dump = () => {
  for (let r = 0; r < 8; r++) {
    let line = '';
    for (let c = 0; c < 2; c++) { for (let k = 0; k < 8; k++) line += b.matrix.lit(c, r, k) ? '#' : '.'; line += '  '; }
    console.log(line);
  }
};
let t0 = Date.now();
for (const t of [0.5, 1.5, 3.0]) {
  b.run(Math.round(t * 8e6 - b.cpu.cycles));
  console.log(`--- t=${t}s frames=${b.matrix.frames} i2c acks=${b.i2c.log.acks} nacks=${b.i2c.log.nacks} accelReads=${b.accel.reads} ctrl1=${b.accel.regs[0x10].toString(16)} bright=${b.matrix.chips.map(c=>c.intensity)} shutdown=${b.matrix.chips.map(c=>c.shutdown)}`);
  dump();
}
console.log('wall ms for 3s sim:', Date.now() - t0, ' serial:', JSON.stringify(b.serial.slice(0, 120)));
