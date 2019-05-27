#!/usr/bin/env node

'use strict';

/**
 * A simple WASI runner which exposes the
 * full environment and arguments to the
 * WASI binary.
 *
 * :wasm:M::\x00\x61\x73\x6d::wasi:
 */

const fs = require('fs');
const WASI = require('.');

if (!process.argv[2]) {
  process.stdout.write(`wasi runner
A simple WASI runner which exposes the full
environment, arguments, and cwd to the WASI
binary.

:wasm:M::\\x00\\x61\\x73\\x6d::wasi:

USAGE:
    wasi <file> ...
`);
  process.exit(1);
}

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
