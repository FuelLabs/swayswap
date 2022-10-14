#!/bin/bash

CURRENT_PATH=$(pwd)
cd $CURRENT_PATH/packages/contracts/token_contract && cargo test
cd $CURRENT_PATH/packages/contracts/exchange_contract && cargo test