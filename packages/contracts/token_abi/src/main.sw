library token_abi;

use std::{address::Address, contract_id::ContractId, token::*};

abi Token {
    // Get balance of the contract coins
    fn get_balance() -> u64;
    // Get balance of a specified token on contract
    fn get_token_balance(asset_id: ContractId) -> u64;
    // Mint token coins
    fn mint_coins(mint_amount: u64);
    // Burn token coins
    fn burn_coins(burn_amount: u64);
    // Transfer a contract coins to a given output
    fn transfer_coins(coins: u64, address: Address);
    // Mint and transfer coins to a given output
    fn mint_and_transfer_coins(coins: u64, address: Address);
    // Transfer a specified token from the contract
    // to a given output
    fn transfer_token_to_output(coins: u64, asset_id: ContractId, recipient: Address);
}
