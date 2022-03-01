contract;

use std::address::*;
use std::block::*;
use std::chain::*;
use std::context::*;
use std::contract_id::{ContractId};
use std::hash::*;
use std::storage::*;
use std::token::*;

////////////////////////////////////////
// Constants
////////////////////////////////////////

/// Token ID of Ether
const ETH_ID = 0x0000000000000000000000000000000000000000000000000000000000000000;

/// Contract ID of the token on the other side of the pool.
/// Modify at compile time for different pool.
const TOKEN_ID = 0x0000000000000000000000000000000000000000000000000000000000000001;

/// Minimum ETH liquidity to open a pool.
const MINIMUM_LIQUIDITY = 1000000000;

////////////////////////////////////////
// Events
////////////////////////////////////////

struct DepositEvent {
    from: Address,
    amount: u64,
    asset_id: ContractId,
}

struct WithdrawEvent {
    to: Address,
    amount: u64,
    asset_id: ContractId,
}

struct TokenPurchaseEvent {
    buyer: Address,
    eth_sold: u64,
    tokens_bought: u64,
}

struct EthPurchaseEvent {
    buyer: Address,
    tokens_sold: u64,
    eth_bought: u64,
}

struct AddLiquidityEvent {
    provider: Address,
    eth_amount: u64,
    token_amount: u64,
}

struct RemoveLiquidityEvent {
    provider: Address,
    eth_amount: u64,
    token_amount: u64,
}

struct TransferEvent {
    from: Address,
    to: Address,
    amount: u64,
    asset_id: ContractId,
}

////////////////////////////////////////
// ABI parameters
////////////////////////////////////////

struct WithdrawParams {
    amount: u64,
    asset_id: ContractId,
}

struct AddLiquidityParams {
    min_liquidity: u64,
    max_tokens: u64,
    deadline: u64,
}

struct RemoveLiquidityParams {
    min_eth: u64,
    min_tokens: u64,
    deadline: u64,
}

struct SwapWithMinimumParams {
    min: u64,
    deadline: u64,
}

struct SwapWithMaximumParams {
    amount: u64,
    max: u64,
    deadline: u64,
}

////////////////////////////////////////
// ABI declaration
////////////////////////////////////////

abi Exchange {
    /// Deposit coins for later adding to liquidity pool.
    fn deposit(gas_: u64, amount_: u64, asset_id_: b256, params: ());
    /// Withdraw coins that have not been added to a liquidity pool yet.
    fn withdraw(gas_: u64, amount_: u64, asset_id_: b256, params: WithdrawParams);
    /// Deposit ETH and Tokens at current ratio to mint SWAYSWAP tokens.
    fn add_liquidity(gas_: u64, amount_: u64, asset_id_: b256, params: AddLiquidityParams) -> u64;
    /// Burn SWAYSWAP tokens to withdraw ETH and Tokens at current ratio.
    fn remove_liquidity(gas_: u64, amount_: u64, asset_id_: b256, params: RemoveLiquidityParams) -> (u64, u64);
    /// Swap ETH <-> Tokens and tranfers to sender.
    fn swap_with_minimum(gas_: u64, amount_: u64, asset_id_: b256, params: SwapWithMinimumParams) -> u64;
    /// Swap ETH <-> Tokens and tranfers to sender.
    fn swap_with_maximum(gas_: u64, amount_: u64, asset_id_: b256, params: SwapWithMaximumParams) -> u64;
}

////////////////////////////////////////
// Storage declarations
////////////////////////////////////////

/// Storage delimited
const S_DEPOSITS: b256 = 0x0000000000000000000000000000000000000000000000000000000000000000;
const S_TOTAL_SUPPLY: b256 = 0x0000000000000000000000000000000000000000000000000000000000000001;

////////////////////////////////////////
// Helper functions
////////////////////////////////////////

/// Compute the storage slot for an address's deposits.
fn key_deposits(a: Address, asset_id: b256) -> b256 {
    let inner = hash_pair(a.into(), asset_id, HashMethod::Sha256);
    hash_pair(S_DEPOSITS, inner, HashMethod::Sha256)
}

/// Pricing function for converting between ETH and Tokens.
fn get_input_price(input_amount: u64, input_reserve: u64, output_reserve: u64) -> u64 {
    assert(input_reserve > 0 && output_reserve > 0);
    let input_amount_with_fee: u64 = input_amount * 997;
    let numerator: u64 = input_amount_with_fee * output_reserve;
    let denominator: u64 = (input_reserve * 1000) + input_amount_with_fee;
    numerator / denominator
}

/// Pricing function for converting between ETH and Tokens.
fn get_output_price(output_amount: u64, input_reserve: u64, output_reserve: u64) -> u64 {
    assert(input_reserve > 0 && output_reserve > 0);
    let numerator: u64 = input_reserve * output_reserve * 1000;
    let denominator: u64 = (output_reserve - output_amount) * 997;
    numerator / denominator + 1
}

// ////////////////////////////////////////
// // ABI definitions
// ////////////////////////////////////////

impl Exchange for Contract {
    fn deposit(gas_: u64, amount_: u64, asset_id_: b256, params: ()) {
        assert(msg_asset_id() == ETH_ID || msg_asset_id() == TOKEN_ID);

        // TODO replace
        // let sender = msg_sender().unwrap();
        let sender = ~Address::from(0x0000000000000000000000000000000000000000000000000000000000000000);
        let key = key_deposits(sender, msg_asset_id());

        let total_amount = get::<u64>(key) + msg_amount();
        store(key, total_amount);
    }

    fn withdraw(gas_: u64, amount_: u64, asset_id_: b256, params: WithdrawParams) {
        let asset_id = params.asset_id.into();
        assert(asset_id == ETH_ID || asset_id == TOKEN_ID);

        // TODO replace
        // let sender = msg_sender().unwrap();
        let sender = ~Address::from(0x0000000000000000000000000000000000000000000000000000000000000000);
        let key = key_deposits(sender, asset_id);

        let deposited_amount = get::<u64>(key);
        assert(deposited_amount >= params.amount);

        let new_amount = deposited_amount - params.amount;
        store(key, new_amount);

        transfer_to_output(params.amount, ~ContractId::from(contract_id()), sender);
    }

    fn add_liquidity(gas_: u64, amount_: u64, asset_id_: b256, params: AddLiquidityParams) -> u64 {
        // No coins should be sent with this call. Coins should instead be `deposit`ed prior.
        assert(msg_amount() == 0);
        assert(params.deadline > height());
        assert(params.max_tokens > 0);
        assert(msg_asset_id() == ETH_ID || msg_asset_id() == TOKEN_ID);

        // TODO replace
        // let sender = msg_sender().unwrap();
        let sender = ~Address::from(0x0000000000000000000000000000000000000000000000000000000000000000);

        let total_liquidity = get::<u64>(S_TOTAL_SUPPLY);

        let eth_amount_key = key_deposits(sender, ETH_ID);
        let eth_amount = get::<u64>(eth_amount_key);
        store(eth_amount_key, 0);
        let token_amount_key = key_deposits(sender, TOKEN_ID);
        let token_amount = get::<u64>(token_amount_key);
        store(token_amount_key, 0);

        // TODO do we also need to assert the token amount > 0?
        assert(eth_amount > 0);

        let mut minted: u64 = 0;
        if total_liquidity > 0 {
            assert(params.min_liquidity > 0);

            let eth_reserve = this_balance(ETH_ID) - eth_amount;
            let token_reserve = this_balance(TOKEN_ID);
            let token_amount = eth_amount * token_reserve / eth_reserve + 1;
            let liquidity_minted = eth_amount * total_liquidity / eth_reserve;

            assert(params.max_tokens >= token_reserve && liquidity_minted >= params.min_liquidity);

            mint(liquidity_minted);
            store(S_TOTAL_SUPPLY, total_liquidity + liquidity_minted);

            transfer_to_output(liquidity_minted, ~ContractId::from(contract_id()), sender);

            minted = liquidity_minted;
        } else {
            assert(eth_amount > MINIMUM_LIQUIDITY);

            let token_amount = params.max_tokens;
            let initial_liquidity = this_balance(ETH_ID);

            mint(initial_liquidity);
            store(S_TOTAL_SUPPLY, initial_liquidity);

            transfer_to_output(initial_liquidity, ~ContractId::from(contract_id()), sender);

            minted = initial_liquidity;
        };

        minted
    }

    fn remove_liquidity(gas_: u64, amount_: u64, asset_id_: b256, params: RemoveLiquidityParams) -> (u64, u64) {
        assert(msg_amount() > 0);
        assert(msg_asset_id() == contract_id());
        assert(params.deadline > height());
        assert(params.min_eth > 0 && params.min_tokens > 0);

        // TODO replace
        // let sender = msg_sender().unwrap();
        let sender = ~Address::from(0x0000000000000000000000000000000000000000000000000000000000000000);

        let total_liquidity = get::<u64>(S_TOTAL_SUPPLY);
        assert(total_liquidity > 0);

        let eth_reserve = this_balance(ETH_ID);
        let token_reserve = this_balance(TOKEN_ID);

        let eth_amount = msg_amount() * eth_reserve / total_liquidity;
        let token_amount = msg_amount() * token_reserve / total_liquidity;

        assert(eth_amount >= params.min_eth && token_amount >= params.min_tokens);

        burn(msg_amount());
        store(S_TOTAL_SUPPLY, total_liquidity - msg_amount());

        transfer_to_output(eth_amount, ~ContractId::from(ETH_ID), sender);
        transfer_to_output(token_amount, ~ContractId::from(TOKEN_ID), sender);

        (eth_amount, token_amount)
    }

    fn swap_with_minimum(gas_: u64, amount_: u64, asset_id_: b256, params: SwapWithMinimumParams) -> u64 {
        assert(params.deadline >= height());
        assert(msg_amount() > 0 && params.min > 0);
        assert(msg_asset_id() == ETH_ID || msg_asset_id() == TOKEN_ID);

        // TODO replace
        // let sender = msg_sender().unwrap();
        let sender = ~Address::from(0x0000000000000000000000000000000000000000000000000000000000000000);

        let eth_reserve = this_balance(ETH_ID);
        let token_reserve = this_balance(TOKEN_ID);

        let mut bought = 0;
        if (msg_asset_id() == ETH_ID) {
            let tokens_bought = get_input_price(msg_amount(), eth_reserve, token_reserve);
            assert(tokens_bought >= params.min);
            transfer_to_output(tokens_bought, ~ContractId::from(TOKEN_ID), sender);
            bought = tokens_bought;
        } else {
            let eth_bought = get_input_price(msg_amount(), token_reserve, eth_reserve);
            assert(eth_bought >= params.min);
            transfer_to_output(eth_bought, ~ContractId::from(ETH_ID), sender);
            bought = eth_bought;
        };

        bought
    }

    fn swap_with_maximum(gas_: u64, amount_: u64, asset_id_: b256, params: SwapWithMaximumParams) -> u64 {
        assert(params.deadline >= height());
        assert(params.amount > 0 && params.max > 0);
        assert(msg_asset_id() == ETH_ID || msg_asset_id() == TOKEN_ID);

        // TODO replace
        // let sender = msg_sender().unwrap();
        let sender = ~Address::from(0x0000000000000000000000000000000000000000000000000000000000000000);

        let eth_reserve = this_balance(ETH_ID);
        let token_reserve = this_balance(TOKEN_ID);

        let mut sold = 0;
        if (msg_asset_id() == ETH_ID) {
            let eth_sold = get_output_price(msg_amount(), eth_reserve, token_reserve);
            let refund = params.max - eth_sold;
            if refund > 0 {
                transfer_to_output(refund, ~ContractId::from(ETH_ID), sender);
            };
            transfer_to_output(params.amount, ~ContractId::from(TOKEN_ID), sender);
            sold = eth_sold;
        } else {
            let tokens_sold = get_output_price(msg_amount(), token_reserve, eth_reserve);
            let refund = params.max - tokens_sold;
            if refund > 0 {
                transfer_to_output(refund, ~ContractId::from(TOKEN_ID), sender);
            };
            transfer_to_output(params.amount, ~ContractId::from(ETH_ID), sender);
            sold = tokens_sold;
        };

        sold
    }
}
