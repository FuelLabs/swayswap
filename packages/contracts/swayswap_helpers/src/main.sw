library swayswap_helpers;

use std::{
    auth::msg_sender,
};

/// Return the sender as an Address or panic
pub fn get_msg_sender_address_or_panic() -> Address {
    let sender = msg_sender();
    if let Identity::Address(address) = sender.unwrap() {
       address
    } else {
       revert(420);
    }
}
