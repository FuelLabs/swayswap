contract;

use std::{storage::*};

// Return b256 values from storage
fn get_b256(key: b256) -> b256 {
    asm(r1: key, r2) {
        move r2 sp;
        cfei i32;
        srwq r2 r1;
        r2: b256
    }
}

// Store b256 values on memory
fn store_b256(key: b256, value: b256) {
    asm(r1, r2: key, r3: value) {
        move r1 r3;
        swwq r2 r1;
    };
}

abi SwapSwap {
    // Add exchange contract to the token
    fn add_exchange_contract(token_id: b256, exchange_id: b256);
    // Get exchange contract for desired token
    fn get_exchange_contract(token_id: b256) -> b256;
}

impl SwapSwap for Contract {
    fn add_exchange_contract(token_id: b256, exchange_id: b256) {
        // TODO: Assert exchange contract binary to avoid non exchange contracts to be saved
        store_b256(token_id, exchange_id);
    }
    fn get_exchange_contract(token_id: b256) -> b256 {
        get_b256(token_id)
    }
}
