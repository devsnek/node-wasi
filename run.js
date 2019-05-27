#!/usr/bin/env node

'use strict';

/**
 * A simple WASI runner which exposes the
 * fulle environment and arguments to the
 * WASI binary.
 *
 * :wasm:M::\x00\x61\x73\x6d::wasi:
 */


const fs = require('fs');
const WASI = require('.');

const bin = fs.readFileSync(process.argv[2]);

const mod = new WebAssembly.Module(bin);

const wasi = new WASI({
  preopenDirectories: { '.': '.' },
  env: process.env,
  args: process.argv.slice(2),
});
const instance = new WebAssembly.Instance(mod, {
  wasi_unstable: wasi.exports,
});

wasi.setMemory(instance.exports.memory);

instance.exports._start();
