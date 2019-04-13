# node-wasi

# This module and WASI are still in early development!
# Expect bugs and breaking changes!

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
