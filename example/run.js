'use strict';

const fs = require('fs');
const WASI = require('..');

const bin = fs.readFileSync('./cowsay.wasm');

const mod = new WebAssembly.Module(bin);

const wasi = new WASI({
  env: process.env,
  args: process.argv.slice(1),
});
const instance = new WebAssembly.Instance(mod, {
  wasi_unstable: wasi.exports,
});

wasi.setMemory(instance.exports.memory);

instance.exports._start();
