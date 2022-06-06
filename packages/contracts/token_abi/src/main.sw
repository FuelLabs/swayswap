library token_abi;

use std::{address::Address, contract_id::ContractId, token::*};

abi Token {
    fn get_balance() -> u64;
    fn mint_coins(mint_amount: u64);
    fn burn_coins(burn_amount: u64);
    fn transfer_coins(coins: u64, address: Address);
    // Transfer
    fn transfer_token_to_output(coins: u64, asset_id: ContractId, recipient: Address);
}
