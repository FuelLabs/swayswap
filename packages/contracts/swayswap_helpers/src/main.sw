library swayswap_helpers;

use std::{
    address::*,
    block::*,
    auth::{
        AuthError,
        msg_sender,
    },
    result::*,
    revert::revert,
    identity::Identity,
};

pub fn get_b256(key: b256) -> b256 {
    asm (key, is_set, r2, count: 1) {
        move r2 sp;
        cfei i32;
        srwq r2 is_set key count;
        r2: b256
    }
}

// Store b256 values on memory
pub fn store_b256(key: b256, value: b256) {
    asm(key, is_set, value, count: 1) {
        swwq key is_set value count;
    };
}

/// Return the sender as an Address or panic
pub fn get_msg_sender_address_or_panic() -> Address {
    let sender: Result<Identity, AuthError> = msg_sender();
    if let Identity::Address(address) = sender.unwrap() {
       address
    } else {
       revert(0);
    }
}
