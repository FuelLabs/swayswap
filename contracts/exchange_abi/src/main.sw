library exchange_abi;

use std::contract_id::ContractId;

pub struct RemoveLiquidityReturn {
    eth_amount: u64,
    token_amount: u64,
}

pub struct PoolInfo {
    eth_reserve: u64,
    token_reserve: u64,
    lp_token_supply: u64,
}

pub struct PreviewInfo {
    amount: u64,
    has_liquidity: bool,
}

abi Exchange {
    /// Return the current balance of given token on the contract
    fn get_balance(token: ContractId) -> u64;
    /// Deposit coins for later adding to liquidity pool.
    fn deposit();
    /// Withdraw coins that have not been added to a liquidity pool yet.
    fn withdraw(amount: u64, asset_id: ContractId);
    /// Deposit ETH and Tokens at current ratio to mint SWAYSWAP tokens.
    fn add_liquidity(min_liquidity: u64, max_tokens: u64, deadline: u64) -> u64;
    /// Burn SWAYSWAP tokens to withdraw ETH and Tokens at current ratio.
    fn remove_liquidity(min_eth: u64, min_tokens: u64, deadline: u64) -> RemoveLiquidityReturn;
    /// Swap ETH <-> Tokens and tranfers to sender.
    fn swap_with_minimum(min: u64, deadline: u64) -> u64;
    /// Swap ETH <-> Tokens and tranfers to sender.
    fn swap_with_maximum(amount: u64, deadline: u64) -> u64;
    /// Get information on the liquidity pool.
    fn get_info() -> PoolInfo;
    /// Get the minimum amount of coins that will be received for a swap_with_minimum.
    fn get_swap_with_minimum(amount: u64) -> PreviewInfo;
    /// Get required amount of coins for a swap_with_maximum.
    fn get_swap_with_maximum(amount: u64) -> PreviewInfo;
}
