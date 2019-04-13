# node-wasi

A module to use WASI modules with Node.js.

```js
const WASI = require('wasi');

const wasi = new WASI({
  // preopenDir: '.',
});

const inst = new WebAssembly.Instance(module, {
  wasi_unstable: wasi.exports,
});
wasi.setMemory(inst.exports.memory);

inst.exports._start();
```
