#!/bin/bash

for file in c/*.c; do
  filename=$(basename -- "$file")
  filename="${filename%.*}"
  /opt/wasi-sdk/bin/clang $file -target wasm32-unknown-wasi -o out/$filename.wasm
  echo -e "\nRunning out/$filename.wasm"
  node --experimental-wasm-bigint run.js out/$filename.wasm
done
