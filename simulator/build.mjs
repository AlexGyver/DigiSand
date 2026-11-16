import * as esbuild from 'esbuild';
import fs from 'fs';
const r = await esbuild.build({ entryPoints: ['src/main.js'], bundle: true, minify: true, format: 'iife', write: false,
  loader: { '.hex': 'text', '.json': 'json' }, target: 'es2019' });
const js = r.outputFiles[0].text;
const img = 'data:image/jpeg;base64,' + fs.readFileSync('board.jpg').toString('base64');
let html = fs.readFileSync('src/index.html', 'utf8').replace('__BOARD__', img);
html = html.split('<script>__SCRIPT__</script>').join('<script>' + js.replace(/<\/script/g, '<\\/script') + '</script>');
fs.writeFileSync('dist/index.html', html);
console.log('html', (html.length / 1024).toFixed(0), 'KB');
