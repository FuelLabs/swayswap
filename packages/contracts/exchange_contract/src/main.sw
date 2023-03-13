contract;

use std::{
    assert::assert,
    block::*,
    auth::*,
    call_frames::{contract_id, msg_asset_id},
    context::{*},
    hash::*,
    storage::*,
    token::*,
    u128::U128,
    logging::log,
};

use exchange_abi::{Exchange, PoolInfo, PositionInfo, PreviewInfo, RemoveLiquidityInfo, PreviewAddLiquidityInfo};
use swayswap_helpers::get_msg_sender_address_or_panic;

////////////////////////////////////////
// Constants
////////////////////////////////////////

/// The token id key from storage
/// Contract ID of the token on one side of the pool.
/// Set of the deploy time
const TOKEN_ID_KEY1 = 0x0000000000000000000000000000000000000000000000000000000000000001;

/// The token id key from storage
/// Contract ID of the token on the other side of the pool.
/// Set of the deploy time
const TOKEN_ID_KEY2 = 0x0000000000000000000000000000000000000000000000000000000000000002;

/// Minimum ETH liquidity to open a pool.
const MINIMUM_LIQUIDITY = 1; //A more realistic value would be 1000000000;
// Liquidity miner fee apply to all swaps
const LIQUIDITY_MINER_FEE = 333;

////////////////////////////////////////
// Storage declarations
////////////////////////////////////////

storage {
    lp_token_supply: u64 = 0,
    deposits: StorageMap<(Address, ContractId), u64> = StorageMap {},
}

////////////////////////////////////////
// Helper functions
////////////////////////////////////////

/// Return token reserve balance
#[storage(read)]
fn get_current_reserve(token_id: b256) -> u64 {
    get::<u64>(token_id).unwrap_or(0)
}

/// Add amount to the token reserve
#[storage(read, write)]
fn add_reserve(token_id: b256, amount: u64) {
    let value = get::<u64>(token_id).unwrap_or(0);
    store(token_id, value + amount);
}

/// Remove amount to the token reserve
#[storage(read, write)]
fn remove_reserve(token_id: b256, amount: u64) {
    let value = get::<u64>(token_id).unwrap_or(0);
    store(token_id, value - amount);
}
// Calculate 0.3% fee
fn calculate_amount_with_fee(amount: u64) -> u64 {
    let fee: u64 = (amount / LIQUIDITY_MINER_FEE);
    amount - fee
}

fn mutiply_div(a: u64, b: u64, c: u64) -> u64 {
    let calculation = (U128::from((0, a)) * U128::from((0, b)));
    let result_wrapped = (calculation / U128::from((0, c))).as_u64();

    // TODO remove workaround once https://github.com/FuelLabs/sway/pull/1671 lands.
    match result_wrapped {
        Result::Ok(inner_value) => inner_value, _ => revert(0), 
    }
}

fn div_mutiply(a: u64, b: u64, c: u64) -> u64 {
    let calculation = (U128::from((0, a)) / U128::from((0, b)));
    let result_wrapped = (calculation * U128::from((0, c))).as_u64();

    // TODO remove workaround once https://github.com/FuelLabs/sway/pull/1671 lands.
    match result_wrapped {
        Result::Ok(inner_value) => inner_value, _ => revert(0), 
    }
}

/// Pricing function for converting between ETH and Tokens.
fn get_input_price(input_amount: u64, input_reserve: u64, output_reserve: u64) -> u64 {
    assert(input_reserve > 0 && output_reserve > 0);
    let input_amount_with_fee: u64 = calculate_amount_with_fee(input_amount);
    let numerator = U128::from((0, input_amount_with_fee)) * U128::from((0, output_reserve));
    let denominator = U128::from((0, input_reserve)) + U128::from((0, input_amount_with_fee));
    let result_wrapped = (numerator / denominator).as_u64();
    // TODO remove workaround once https://github.com/FuelLabs/sway/pull/1671 lands.
    match result_wrapped {
        Result::Ok(inner_value) => inner_value, _ => revert(0), 
    }
}

/// Pricing function for converting between ETH and Tokens.
fn get_output_price(output_amount: u64, input_reserve: u64, output_reserve: u64) -> u64 {
    assert(input_reserve > 0 && output_reserve > 0);
    let numerator = U128::from((0, input_reserve)) * U128::from((0, output_amount));
    let denominator = U128::from((0, calculate_amount_with_fee(output_reserve - output_amount)));
    let result_wrapped = (numerator / denominator).as_u64();
    if denominator > numerator {
        // Emulate Infinity Value
        u64::max()
    } else {
        // TODO remove workaround once https://github.com/FuelLabs/sway/pull/1671 lands.
        match result_wrapped {
            Result::Ok(inner_value) => inner_value + 1, _ => revert(0), 
        }
    }
}

// ////////////////////////////////////////
// // ABI definitions
// ////////////////////////////////////////
impl Exchange for Contract {
    #[storage(read)]
    fn get_balance(asset_id: ContractId) -> u64 {
        let sender = get_msg_sender_address_or_panic();
        storage.deposits.get((sender, asset_id)).unwrap_or(0)
    }

    #[storage(read)]
    fn get_pool_info() -> PoolInfo {
        PoolInfo {
            token_reserve1: get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap()),
            token_reserve2: get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap()),
            lp_token_supply: storage.lp_token_supply,
        }
    }

    #[storage(read)]
    fn get_position(amount: u64) -> PositionInfo {
        let total_liquidity = storage.lp_token_supply;
        let token_reserve1 = get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap());
        let token_reserve2 = get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap());
        let token_amount1 = mutiply_div(amount, token_reserve1, total_liquidity);
        let token_amount2 = mutiply_div(amount, token_reserve2, total_liquidity);

        PositionInfo {
            lp_token_supply: total_liquidity,
            token_reserve1: token_reserve1,
            token_reserve2: token_reserve2,
            token_amount1: token_amount1,
            token_amount2: token_amount2
        }
    }

    #[storage(read), payable]
    fn get_add_liquidity(amount: u64, asset_id: b256) -> PreviewAddLiquidityInfo {
        let token_id1 = get::<b256>(TOKEN_ID_KEY1).unwrap();
        let token_id2 = get::<b256>(TOKEN_ID_KEY2).unwrap();
        let total_liquidity = storage.lp_token_supply;
        let token_reserve1 = get_current_reserve(token_id1);
        let token_reserve2 = get_current_reserve(token_id2);
        let mut current_token_amount2 = amount;
        let mut lp_token_received = 0;
        let mut token_amount1 = 0;
  
        if (asset_id == token_id1) {
            current_token_amount2 = mutiply_div(amount, token_reserve2, token_reserve1);
        }

        if total_liquidity > 0 {
            token_amount1 = mutiply_div(current_token_amount2, token_reserve1, token_reserve2);
            lp_token_received = mutiply_div(current_token_amount2, total_liquidity, token_reserve2);
        } else {
            lp_token_received = current_token_amount2;
        };

        if (asset_id == token_id1) {
            token_amount1 = current_token_amount2;
        }

        PreviewAddLiquidityInfo {
            token_amount: token_amount1,
            lp_token_received: lp_token_received,
        }
    }

    #[storage(read, write), payable]
    fn deposit() {
        assert(msg_asset_id().into() == get::<b256>(TOKEN_ID_KEY1).unwrap() || msg_asset_id().into() == get::<b256>(TOKEN_ID_KEY2).unwrap());

        let sender = get_msg_sender_address_or_panic();

        let total_amount = storage.deposits.get((sender, msg_asset_id())).unwrap_or(0) + msg_amount();
        storage.deposits.insert((sender, msg_asset_id()), total_amount);
    }

    #[storage(read, write)]
    fn withdraw(amount: u64, asset_id: ContractId) {
        assert(asset_id.into() ==  get::<b256>(TOKEN_ID_KEY1).unwrap() || asset_id.into() == get::<b256>(TOKEN_ID_KEY2).unwrap());

        let sender = get_msg_sender_address_or_panic();

        let deposited_amount = storage.deposits.get((sender, asset_id)).unwrap_or(0);
        assert(deposited_amount >= amount);

        let new_amount = deposited_amount - amount;
        storage.deposits.insert((sender, asset_id), new_amount);

        transfer_to_address(amount, asset_id, sender)
    }

    #[storage(read, write)]
    fn add_liquidity(min_liquidity: u64, deadline: u64) -> u64 {
        assert(msg_amount() == 0);
        assert(deadline > height());
        assert(msg_asset_id().into() == get::<b256>(TOKEN_ID_KEY1).unwrap() || msg_asset_id().into() == get::<b256>(TOKEN_ID_KEY2).unwrap());

        let sender = get_msg_sender_address_or_panic();

        let total_liquidity = storage.lp_token_supply;

        let current_token_amount1 = storage.deposits.get((sender, ContractId::from(get::<b256>(TOKEN_ID_KEY1).unwrap()))).unwrap_or(0);
        let current_token_amount2 = storage.deposits.get((sender, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap()))).unwrap_or(0);

        assert(current_token_amount1 > 0);

        let mut minted: u64 = 0;
        if total_liquidity > 0 {
            assert(min_liquidity > 0);

            let token_reserve1 = get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap());
            let token_reserve2 = get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap());
            let token_amount = mutiply_div(current_token_amount1, token_reserve2, token_reserve1);
            let liquidity_minted = mutiply_div(current_token_amount1, total_liquidity, token_reserve1);

            assert(liquidity_minted >= min_liquidity);

            // if token ratio is correct, proceed with liquidity operation
            // otherwise, return current user balances in contract
            if (current_token_amount2 >= token_amount) {
                // Add fund to the reserves
                add_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap(), token_amount);
                add_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap(), current_token_amount1);
                // Mint LP token
                mint(liquidity_minted);
                storage.lp_token_supply = total_liquidity + liquidity_minted;

                transfer_to_address(liquidity_minted, contract_id(), sender);

                // If user sent more than the correct ratio, we deposit back the extra tokens
                let token_extra = current_token_amount2 - token_amount;
                if (token_extra > 0) {
                    transfer_to_address(token_extra, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap()), sender);
                }

                minted = liquidity_minted;
            } else {
                transfer_to_address(current_token_amount1, ContractId::from(get::<b256>(TOKEN_ID_KEY1).unwrap()), sender);
                transfer_to_address(current_token_amount2, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap()), sender);
                minted = 0;
            }
        } else {
            assert(current_token_amount1 > MINIMUM_LIQUIDITY);

            let initial_liquidity = current_token_amount1;

            // Add fund to the reserves
            add_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap(), current_token_amount2);
            add_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap(), current_token_amount1);

            // Mint LP token
            mint(initial_liquidity);
            storage.lp_token_supply = initial_liquidity;

            transfer_to_address(initial_liquidity, contract_id(), sender);

            minted = initial_liquidity;
        };

        // Clear user contract balances after finishing add/create liquidity
        storage.deposits.insert((sender, ContractId::from(get::<b256>(TOKEN_ID_KEY1).unwrap())), 0);
        storage.deposits.insert((sender, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap())), 0);

        minted
    }

    #[storage(read, write), payable]
    fn remove_liquidity(min_tokens1: u64, min_tokens2: u64, deadline: u64) -> RemoveLiquidityInfo {
        assert(msg_amount() > 0);
        assert(msg_asset_id().into() == (contract_id()).into());
        assert(deadline > height());
        assert(min_tokens1 > 0 && min_tokens2 > 0);

        let sender = get_msg_sender_address_or_panic();

        let total_liquidity = storage.lp_token_supply;
        assert(total_liquidity > 0);

        let token_reserve1 = get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap());
        let token_reserve2 = get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap());
        let token_amount1 = mutiply_div(msg_amount(), token_reserve1, total_liquidity);
        let token_amount2 = mutiply_div(msg_amount(), token_reserve2, total_liquidity);

        assert((token_amount1 >= min_tokens1) && (token_amount2 >= min_tokens2));

        burn(msg_amount());
        storage.lp_token_supply = total_liquidity - msg_amount();

        // Add fund to the reserves
        remove_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap(), token_amount1);
        remove_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap(), token_amount2);

        // Send tokens back
        transfer_to_address(token_amount1, ContractId::from(get::<b256>(TOKEN_ID_KEY1).unwrap()), sender);
        transfer_to_address(token_amount2, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap()), sender);

        RemoveLiquidityInfo {
            token_amount1,
            token_amount2,
        }
    }

    #[storage(read, write), payable]
    fn swap_with_minimum(min: u64, deadline: u64) -> u64 {
        let asset_id = msg_asset_id().into();
        let forwarded_amount = msg_amount();

        assert(deadline >= height());
        assert(forwarded_amount > 0 && min > 0);
        assert(asset_id == get::<b256>(TOKEN_ID_KEY1).unwrap() || asset_id == get::<b256>(TOKEN_ID_KEY2).unwrap());

        let sender = get_msg_sender_address_or_panic();

        let token_reserve1 = get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap());
        let token_reserve2 = get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap());

        let mut tokens_bought = 0;
        if (asset_id == get::<b256>(TOKEN_ID_KEY1).unwrap()) {
            tokens_bought = get_input_price(forwarded_amount, token_reserve1, token_reserve2);
            assert(tokens_bought >= min);
            transfer_to_address(tokens_bought, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap()), sender);
            // Update reserve
            add_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap(), forwarded_amount);
            remove_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap(), tokens_bought);
        } else {
            tokens_bought = get_input_price(forwarded_amount, token_reserve2, token_reserve1);
            assert(tokens_bought >= min);
            transfer_to_address(tokens_bought, ContractId::from(get::<b256>(TOKEN_ID_KEY1).unwrap()), sender);
            // Update reserve
            remove_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap(), tokens_bought);
            add_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap(), forwarded_amount);
        };
        bought
    }

    #[storage(read, write), payable]
    fn swap_with_maximum(amount: u64, deadline: u64) -> u64 {
        let asset_id = msg_asset_id().into();
        let forwarded_amount = msg_amount();

        assert(deadline >= height());
        assert(amount > 0 && forwarded_amount > 0);
        assert(asset_id == get::<b256>(TOKEN_ID_KEY1).unwrap() || asset_id == get::<b256>(TOKEN_ID_KEY2).unwrap());

        let sender = get_msg_sender_address_or_panic();
        let token_reserve1 = get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap());
        let token_reserve2 = get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap());

        let mut sold = 0;
        if (asset_id == get::<b256>(TOKEN_ID_KEY1).unwrap()) {
            let tokens_sold = get_output_price(amount, token_reserve1, token_reserve2);
            assert(forwarded_amount >= tokens_sold);
            let refund = forwarded_amount - tokens_sold;
            if refund > 0 {
                transfer_to_address(refund, ContractId::from(get::<b256>(TOKEN_ID_KEY1).unwrap()), sender);
            };
            transfer_to_address(amount, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap()), sender);
            sold = tokens_sold;
            // Update reserve
            add_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap(), tokens_sold);
            remove_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap(), amount);
        } else {
            let tokens_sold = get_output_price(amount, token_reserve2, token_reserve1);
            assert(forwarded_amount >= tokens_sold);
            let refund = forwarded_amount - tokens_sold;
            if refund > 0 {
                transfer_to_address(refund, ContractId::from(get::<b256>(TOKEN_ID_KEY2).unwrap()), sender);
            };
            transfer_to_address(amount, ContractId::from(get::<b256>(TOKEN_ID_KEY1).unwrap()), sender);
            sold = tokens_sold;
            // Update reserve
            remove_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap(), amount);
            add_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap(), tokens_sold);
        };
        sold
    }

    #[storage(read, write)]
    fn get_swap_with_minimum(amount: u64) -> PreviewInfo {
        let token_reserve1 = get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap());
        let token_reserve2 = get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap());
        let mut sold = 0;
        let mut has_liquidity = true;
        if (msg_asset_id().into() == get::<b256>(TOKEN_ID_KEY1).unwrap()) {
            sold = get_input_price(amount, token_reserve1, token_reserve2);
            has_liquidity = sold < token_reserve2;
        } else {
            sold = get_input_price(amount, token_reserve2, token_reserve1);
            has_liquidity = sold < token_reserve1;
        }
        PreviewInfo {
            amount: sold,
            has_liquidity: has_liquidity,
        }
    }

    #[storage(read, write)]
    fn get_swap_with_maximum(amount: u64) -> PreviewInfo {
        let token_reserve1 = get_current_reserve(get::<b256>(TOKEN_ID_KEY1).unwrap());
        let token_reserve2 = get_current_reserve(get::<b256>(TOKEN_ID_KEY2).unwrap());
        let mut sold = 0;
        let mut has_liquidity = true;
        if (msg_asset_id().into() == get::<b256>(TOKEN_ID_KEY1).unwrap()) {
            assert(amount < token_reserve2);
            sold = get_output_price(amount, token_reserve1, token_reserve2);
            has_liquidity = sold < token_reserve1;
        } else {
            assert(amount < token_reserve1);
            sold = get_output_price(amount, token_reserve2, token_reserve1);
            has_liquidity = sold < token_reserve2;
        }
        PreviewInfo {
            amount: sold,
            has_liquidity: has_liquidity,
        }
    }
}
