import fs from 'fs';
import { Board } from '../src/board.js';
const b = new Board(fs.readFileSync('fw/DigiSand2_original.hex', 'utf8'));
b.run(8e6 * 6);
console.log('original fw: matrix frames', b.matrix.frames, '| i2c acks', b.i2c.log.acks, 'nacks', b.i2c.log.nacks, 'last nack addr 0x' + (b.i2c.log.lastNack||0).toString(16), '| serial', JSON.stringify(b.serial));
