#!/bin/sh

ROOT_DIR=$(realpath ../../)
EXCHANGE_CONTRACT=$ROOT_DIR/contracts/exchange_contract
TOKEN_CONTRACT=$ROOT_DIR/contracts/token_contract

echo $EXCHANGE_CONTRACT
echo $TOKEN_CONTRACT

echo "Build SwaySwap contract"
forc build -p $EXCHANGE_CONTRACT
echo "Build Token contract"
forc build -p $TOKEN_CONTRACT
echo "Build Types for contract"
pnpm exec typechain --target fuels --out-dir=./src/types/contracts '../../contracts/**/out/debug/**.json'
echo "Prettify codes"
pnpm exec prettier --write src/types
