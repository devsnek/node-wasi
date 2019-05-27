'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const assert = require('assert');

const SKIP = [
  'poll',
  'stat',
];

const C_DIR = path.resolve(__dirname, 'c');
const OUT_DIR = path.resolve(__dirname, 'out');
const RUNNER_PATH = path.resolve(__dirname, 'runner.js');

function exec(command, { stdin } = {}) {
  try {
    const stdout = cp.execSync(command, {
      input: stdin,
    });
    return { code: 0, stdout: stdout.toString() };
  } catch (e) {
    if (e.status) {
      return { code: e.status, stdout: '' };
    }
    throw e;
  }
}

function cleanup() {
  exec(`rm -rf ${__dirname}/sandbox_outer/sandbox/testdir`);
  exec(`rm -rf ${__dirname}/sandbox_outer/sandbox/output.txt`);
}

function parseOptions(string) {
  const options = {};
  for (const line of string.split('\n')) {
    if (!line.startsWith('//')) {
      break;
    }
    const [key, value] = line.slice(3).split(': ');
    if (!key || !value) {
      continue;
    }
    options[key] = value.replace(/\\n/g, '\n');
  }
  return options;
}

const files = process.argv[2] ? [process.argv[2]] : fs.readdirSync(C_DIR);

files.forEach((filename) => {
  const file = filename.split('.')[0];

  if (SKIP.includes(file)) {
    return;
  }

  const source = fs.readFileSync(path.join(C_DIR, filename), 'utf8');
  const options = parseOptions(source);

  console.log(file); // eslint-disable-line no-console

  cleanup();

  exec(`/opt/wasi-sdk/bin/clang ${C_DIR}/${filename} -target wasm32-wasi -o ${OUT_DIR}/${file}.wasm`);

  const { code, stdout } = exec(`node --experimental-wasm-bigint ${RUNNER_PATH} ${OUT_DIR}/${file}.wasm`, {
    stdin: options.STDIN,
  });

  if (options.EXIT) {
    assert.strictEqual(code, +options.EXIT);
  } else {
    assert.strictEqual(code, 0);
  }

  assert.strictEqual(stdout, options.STDOUT || '');
});

cleanup();
