contract;

use std::contract_id::ContractId;
use swayswap_helpers::{store_b256, get_b256};

abi SwapSwap {
    // Add exchange contract to the token
    fn add_exchange_contract(token_id: ContractId, exchange_id: ContractId);
    // Get exchange contract for desired token
    fn get_exchange_contract(token_id: ContractId) -> ContractId;
}

impl SwapSwap for Contract {
    fn add_exchange_contract(token_id: ContractId, exchange_id: ContractId) {
        // TODO: Assert exchange contract binary to avoid non exchange contracts to be saved
        store_b256(token_id.into(), exchange_id.into());
    }
    fn get_exchange_contract(token_id: ContractId) -> ContractId {
        ContractId::from(get_b256(token_id.into()))
    }
}
