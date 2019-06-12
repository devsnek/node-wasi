'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const WASI = require('..');

const bin = fs.readFileSync(process.argv[2]);

const mod = new WebAssembly.Module(bin);

const wasi = new WASI({
  preopenDirectories: {
    '/sandbox': path.resolve(__dirname, 'sandbox_outer', 'sandbox'),
    '/tmp': os.tmpdir(),
  },
});

const instance = new WebAssembly.Instance(mod, {
  wasi_unstable: wasi.exports,
});

wasi.setMemory(instance.exports.memory);

instance.exports._start();
