'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const SKIP = [
  'poll',
  'stat',
];

const C_DIR = path.resolve(__dirname, 'c');
const OUT_DIR = path.resolve(__dirname, 'out');
const RUNNER_PATH = path.resolve(__dirname, 'runner.js');

function exec(command) {
  try {
    cp.execSync(command);
    return 0;
  } catch (e) {
    return e.status;
  }
}

function cleanup() {
  exec(`rm -rf ${__dirname}/sandbox_outer/sandbox/testdir`);
  exec(`rm -rf ${__dirname}/sandbox_outer/sandbox/output.txt`);
}

const files = process.argv[2] ? [process.argv[2]] : fs.readdirSync(C_DIR);

files.forEach((filename) => {
  const file = filename.split('.')[0];

  if (SKIP.includes(file)) {
    return;
  }

  console.log(file);

  cleanup();

  exec(`/opt/wasi-sdk/bin/clang ${C_DIR}/${filename} -target wasm32-unknown-wasi -o ${OUT_DIR}/${file}.wasm`);

  const code = exec(`node --experimental-wasm-bigint ${RUNNER_PATH} ${OUT_DIR}/${file}.wasm`);

  if (code !== 0 && code !== 120) {
    throw new Error(`${file}: exit ${code}`);
  }
});

cleanup();
