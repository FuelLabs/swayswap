contract;

use std::{address::Address, context::balance_of, contract_id::ContractId, token::*};
use token_abi::{Token, TokenInfo};

/// Symbol
const TOKEN_SYMBOL = 0x0000000000000000000000000000000000000000000000000000000000000000;
/// Name
const TOKEN_NAME = 0x0000000000000000000000000000000000000000000000000000000000000001;

fn get_storage(key: b256) -> b256 {
    asm(r1: key, r2) {
        move r2 sp;
        cfei i32;
        srwq r2 r1;
        r2: b256
    }
}

impl Token for Contract {
    fn info() -> TokenInfo {
        TokenInfo {
            name: get_storage(TOKEN_NAME),
            symbol: get_storage(TOKEN_SYMBOL),
        }
    }

    fn mint_coins(mint_amount: u64) {
        mint(mint_amount);
    }

    fn burn_coins(burn_amount: u64) {
        burn(burn_amount);
    }

    fn force_transfer_coins(coins: u64, asset_id: ContractId, target: ContractId) {
        force_transfer(coins, asset_id, target);
    }

    fn transfer_coins_to_output(coins: u64, asset_id: ContractId, recipient: Address) {
        transfer_to_output(coins, asset_id, recipient);
    }

    fn get_balance(target: ContractId, asset_id: ContractId) -> u64 {
        balance_of(target, asset_id)
    }
}
