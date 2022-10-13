#!/bin/bash

# CURRENT_PATH=$(pwd)
# cd $CURRENT_PATH/packages/contracts/token_contract && forc test
# cd $CURRENT_PATH/packages/contracts/exchange_contract && forc test


# TODO: Should enable tests again when issues get resolved.

# Sway unit testing is not yet implemented. Track progress at the following link:
# https://github.com/FuelLabs/sway/issues/1832
# NOTE: Previously this command was used to support Rust integration testing,
# however the provided behaviour served no benefit over running `cargo test`
# directly. The proposal to change the behaviour to support unit testing can be
# found at the following link:
# https://github.com/FuelLabs/sway/issues/1833