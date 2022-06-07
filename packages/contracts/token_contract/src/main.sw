contract;

use std::{address::Address, context::balance_of, contract_id::ContractId, token::*};
use std::context::call_frames::contract_id;
use token_abi::Token;

impl Token for Contract {
    fn get_balance() -> u64 {
        balance_of(contract_id(), contract_id())
    }

    fn get_token_balance(asset_id: ContractId) -> u64 {
        balance_of(asset_id, contract_id())
    }

    fn mint_coins(mint_amount: u64) {
        mint(mint_amount);
    }

    fn burn_coins(burn_amount: u64) {
        burn(burn_amount);
    }

    fn transfer_coins(coins: u64, address: Address) {
        transfer_to_output(coins, contract_id(), address);
    }

    fn transfer_token_to_output(coins: u64, asset_id: ContractId, address: Address) {
        transfer_to_output(coins, asset_id, address);
    }
}
