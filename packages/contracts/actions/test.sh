#!/bin/sh

CURRENT_PATH=$(pwd)
cd $CURRENT_PATH/contracts/token_contract && forc test
cd $CURRENT_PATH/contracts/exchange_contract && forc test