#!/bin/sh

CLIENT_DIR=$(realpath ../)
EXCHANGE_CONTRACT=$CLIENT_DIR/contracts/exchange_contract
TOKEN_CONTRACT=$CLIENT_DIR/contracts/token_contract

echo $EXCHANGE_CONTRACT
echo $TOKEN_CONTRACT

echo "Build SwaySwap contract"
forc build -p $EXCHANGE_CONTRACT
echo "Build Token contract"
forc build -p $TOKEN_CONTRACT
echo "Build Types for contract"
npx typechain --target fuels --out-dir=./src/types/contracts '../contracts/**/out/debug/**.json'
echo "Prettify codes"
npm run prettier-format