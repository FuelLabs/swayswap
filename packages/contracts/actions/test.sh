#!/bin/sh

CURRENT_PATH=$(pwd)
cd $CURRENT_PATH/packages/contracts/token_contract && forc test
cd $CURRENT_PATH/packages/contracts/exchange_contract && forc test