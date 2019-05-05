#!/bin/bash

for file in c/*.c; do
  filename=$(basename -- "$file")
  filename="${filename%.*}"

  if [[ $filename == "poll" ]]; then
    continue
  fi

  /opt/wasi-sdk/bin/clang $file -target wasm32-unknown-wasi -o out/$filename.wasm
  echo -e "\nRunning out/$filename.wasm"
  node --experimental-wasm-bigint run.js out/$filename.wasm

  rc=$?
  if [[ $rc == 120 ]]; then
    continue
  fi

  if [[ $rc != 0 ]]; then
    break
  fi
done

rm ./sandbox_outer/sandbox_inner/output.txt
