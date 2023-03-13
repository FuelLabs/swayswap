use std::{vec, str::FromStr};
use fuels::prelude::*;
use fuels::tx::{StorageSlot, AssetId, ContractId, Bytes32};
use fuels::types::Bits256;
use rand::prelude::{Rng, SeedableRng, StdRng};

///////////////////////////////
// Load the Exchange and Token Contract abi
///////////////////////////////
abigen!(Contract(
    name = "TestExchange",
    abi = "out/debug/exchange_contract-abi.json"),
    Contract(
        name = "TestToken",
        abi = "../token_contract/out/debug/token_contract-abi.json"
    )
);

async fn deposit_and_add_liquidity(
    exchange_instance: &TestExchange,
    token_asset_id1: AssetId,
    token_amount_deposit1: u64,
    token_asset_id2: AssetId,
    token_amount_deposit2: u64,
) -> u64 {
    // Deposit some Token 1 Asset
    let _t = exchange_instance.methods()
        .deposit()
        .call_params(CallParameters::new(Some(token_amount_deposit1), Some(token_asset_id1.clone()), None))
        .unwrap()
        .call()
        .await
        .unwrap();

    // Deposit some Token 2 Asset
    let _t = exchange_instance.methods()
        .deposit()
        .call_params(CallParameters::new(
            Some(token_amount_deposit2),
            Some(token_asset_id2.clone()),
            None,
        ))
        .unwrap()
        .call()
        .await
        .unwrap();

    // Add liquidity for the second time. Keeping the proportion 1:2
    // It should return the same amount of LP as the amount of ETH deposited
    let result = exchange_instance.methods()
        .add_liquidity(1, 1000)
        .call_params(CallParameters::new(Some(0), Some(token_asset_id2.clone()), Some(100_000_000)))
        .unwrap()
        .append_variable_outputs(2)
        .tx_params(TxParameters {
            gas_price: 0,
            gas_limit: 100_000_000,
            maturity: 0,
        })
        .call()
        .await
        .unwrap();

    result.value
}

#[tokio::test]
async fn exchange_contract() {
    // default initial amount 1000000000
    let wallet = launch_provider_and_get_wallet().await;
    // Wallet address
    let address = wallet.address();

    //////////////////////////////////////////
    // Setup contracts
    //////////////////////////////////////////

    let rng = &mut StdRng::seed_from_u64(2322u64);
    let salt1: [u8; 32] = rng.gen();

    let token_contract_id1 = Contract::deploy_with_parameters(
        "../token_contract/out/debug/token_contract.bin",
        &wallet,
        TxParameters::default(),
        StorageConfiguration::default(),
        Configurables::default(),
        Salt::from(salt1),
    ).await.unwrap();

    let salt2: [u8; 32] = rng.gen();

    let token_contract_id2 = Contract::deploy_with_parameters(
        "../token_contract/out/debug/token_contract.bin",
        &wallet,
        TxParameters::default(),
        StorageConfiguration::default(),
        Configurables::default(),
        Salt::from(salt2),
    )
    .await
    .unwrap();


    let key1 = Bytes32::from_str("0x0000000000000000000000000000000000000000000000000000000000000001").unwrap();
    let value1 = token_contract_id1.hash();
    let storage_slot1 = StorageSlot::new(key1, value1);

    let key2 = Bytes32::from_str("0x0000000000000000000000000000000000000000000000000000000000000002").unwrap();
    let value2 = token_contract_id2.hash();
    let storage_slot2 = StorageSlot::new(key2, value2);
    let storage_vec = vec![storage_slot1.clone(), storage_slot2.clone()];

    // Deploy contract and get ID
    let exchange_contract_id = Contract::deploy(
        "out/debug/exchange_contract.bin",
        &wallet,
        TxParameters::default(),
        StorageConfiguration::with_manual_storage(Some(storage_vec)),
    )
    .await
    .unwrap();
    let exchange_instance = TestExchange::new(exchange_contract_id.clone(), wallet.clone());
    let token_instance1 = TestToken::new(token_contract_id1.clone(), wallet.clone());
    let token_instance2 = TestToken::new(token_contract_id2.clone(), wallet.clone());

    // Token 1 asset id
    let token_asset_id1 = AssetId::from(*token_contract_id1.hash());
    // Token 2 asset id
    let token_asset_id2 = AssetId::from(*token_contract_id2.hash());
    // LP Token asset id
    let lp_asset_id = AssetId::from(*exchange_contract_id.hash());

    ////////////////////////////////////////////////////////
    // Mint some tokens to the wallet
    ////////////////////////////////////////////////////////

    // Get the contract ID and a handle to it
    let wallet_token_amount = 20000;

    // Initialize token 1 contract
    token_instance1
        .methods()
        .initialize(wallet_token_amount, Address::from(address))
        .call()
        .await
        .unwrap();

    // Initialize token 1 contract
    token_instance2
        .methods()
        .initialize(wallet_token_amount, Address::from(address))
        .call()
        .await
        .unwrap();

    // Mint some alt tokens
    token_instance1.methods()
        .mint()
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    token_instance2.methods()
        .mint()
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    ////////////////////////////////////////////////////////
    // Test deposit & withdraw NativeToken from ExchangeContract
    ////////////////////////////////////////////////////////

    // Total amount of token 1 to
    // send to the wallet
    let token_amount1 = 100;

    // Deposit some assets
    exchange_instance.methods()
        .deposit()
        .call_params(CallParameters::new(Some(token_amount1), Some(token_asset_id1), None))
        .unwrap()
        .call()
        .await
        .unwrap();

    // Check contract balance
    let response = exchange_instance.methods()
        .get_balance(ContractId::from(token_contract_id1.clone()))
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, token_amount1);

    exchange_instance.methods()
        .withdraw(token_amount1, ContractId::from(token_contract_id1.clone()))
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    // Check contract balance
    let response = exchange_instance.methods()
        .get_balance(ContractId::from(token_contract_id1))
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, 0);

    ////////////////////////////////////////////////////////
    // Deposit tokens and create pool
    ////////////////////////////////////////////////////////

    let native_amount_deposit = token_amount1;
    let token_amount_deposit = 200;
    // Check user position
    let lp_amount_received = deposit_and_add_liquidity(
        &exchange_instance,
        token_asset_id1,
        native_amount_deposit,
        token_asset_id2,
        token_amount_deposit,
    )
    .await;
    assert_eq!(lp_amount_received, token_amount1);

    ////////////////////////////////////////////////////////
    // Remove liquidity and receive assets back
    ////////////////////////////////////////////////////////

    // Remove LP tokens from liquidity it should keep proportion 1:2
    // It should return the exact amount added on the add liquidity
    let result = exchange_instance.methods()
        .remove_liquidity(1, 1, 1000)
        .call_params(CallParameters::new(
            Some(lp_amount_received),
            Some(lp_asset_id.clone()),
            Some(100_000_000)
        ))
        .unwrap()
        .tx_params(TxParameters {
            gas_price: 0,
            gas_limit: 100_000_000,
            maturity: 0,
        })
        .append_variable_outputs(2)
        .call()
        .await
        .unwrap();
    assert_eq!(result.value.token_amount_1, native_amount_deposit);
    assert_eq!(result.value.token_amount_2, token_amount_deposit);

    ////////////////////////////////////////////////////////
    // Setup the pool
    ////////////////////////////////////////////////////////

    // Check user position
    let _t = deposit_and_add_liquidity(
        &exchange_instance,
        token_asset_id1,
        native_amount_deposit,
        token_asset_id2,
        token_amount_deposit,
    )
    .await;

    ////////////////////////////////////////////////////////
    // Amounts
    ////////////////////////////////////////////////////////

    // Swap amount
    let amount: u64 = 10;
    // Amount used on a second add_liquidity
    let eth_to_add_liquidity_amount: u64 = 100;
    // Final balance of LP tokens
    let expected_final_lp_amount: u64 = 199;
    // Final eth amount removed from the Pool
    let remove_liquidity_eth_amount: u64 = 201;
    // Final token amount removed from the Pool
    let remove_liquidity_token_amount: u64 = 388;

    ////////////////////////////////////////////////////////
    // SWAP WITH MINIMUM (TOKEN1 -> TOKEN2)
    ////////////////////////////////////////////////////////

    // Get expected swap amount TOKEN1 -> TOKEN2
    let amount_expected = exchange_instance.methods()
        .get_swap_with_minimum(amount)
        .call_params(CallParameters::new(Some(0), Some(token_asset_id1.clone()), None))
        .unwrap()
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    // Swap using expected amount TOKEN1 -> TOKEN2
    let response = exchange_instance.methods()
        .swap_with_minimum(amount_expected.value.amount, 1000)
        .call_params(CallParameters::new(Some(amount), Some(token_asset_id1), None))
        .unwrap()
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);

    ////////////////////////////////////////////////////////
    // SWAP WITH MINIMUM (TOKEN2 -> TOKEN1)
    ////////////////////////////////////////////////////////

    // Get expected swap amount TOKEN2 -> TOKEN1
    let amount_expected = exchange_instance.methods()
        .get_swap_with_minimum(amount)
        .call_params(CallParameters::new(Some(0), Some(token_asset_id2.clone()), None))
        .unwrap()
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    // Swap using expected amount TOKEN2 -> TOKEN1
    let response = exchange_instance.methods()
        .swap_with_minimum(amount_expected.value.amount, 1000)
        .call_params(CallParameters::new(
            Some(amount),
            Some(token_asset_id2.clone()),
            None
        ))
        .unwrap()
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);

    ////////////////////////////////////////////////////////
    // SWAP WITH MAXIMUM EXPECT ERRORS (TOKEN1 -> TOKEN2)
    ////////////////////////////////////////////////////////

    // Should throw error
    // If the output is bigger them the reserve
    let is_err = exchange_instance.methods()
        .get_swap_with_maximum(1000)
        .call()
        .await
        .is_err();
    assert!(is_err);

    ////////////////////////////////////////////////////////
    // SWAP WITH MAXIMUM EXPECT ERRORS (TOKEN2 -> TOKEN1)
    ////////////////////////////////////////////////////////

    // Should return u64::MAX
    // If the output is equal to the reserve
    let is_err = exchange_instance.methods()
        .get_swap_with_maximum(token_amount_deposit + 1)
        .call()
        .await
        .is_err();
    assert!(is_err);

    ////////////////////////////////////////////////////////
    // SWAP WITH MAXIMUM (ETH -> TOKEN)
    ////////////////////////////////////////////////////////

    // Get expected swap amount ETH -> TOKEN
    let amount_expected = exchange_instance.methods()
        .get_swap_with_maximum(amount)
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    // Swap using expected amount TOKEN1 -> TOKEN2
    let response = exchange_instance.methods()
        .swap_with_maximum(amount, 1000)
        .call_params(CallParameters::new(
            Some(amount_expected.value.amount),
            Some(token_asset_id1),
            None
        ))
        .unwrap()
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);

    ////////////////////////////////////////////////////////
    // SWAP WITH MAXIMUM (TOKEN2 -> TOKEN1)
    ////////////////////////////////////////////////////////

    // Get expected swap amount TOKEN2 -> TOKEN1
    let amount_expected = exchange_instance.methods()
        .get_swap_with_maximum(amount)
        .call_params(CallParameters::new(None, Some(token_asset_id2.clone()), None))
        .unwrap()
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    // Swap using expected amount TOKEN -> ETH
    let response = exchange_instance.methods()
        .swap_with_maximum(amount, 1000)
        .call_params(CallParameters::new(
            Some(amount_expected.value.amount),
            Some(token_asset_id2.clone()),
            None
        ))
        .unwrap()
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);

    ////////////////////////////////////////////////////////
    // Add more liquidity to the contract
    ////////////////////////////////////////////////////////

    let add_liquidity_preview = exchange_instance.methods()
        .get_add_liquidity(eth_to_add_liquidity_amount, Bits256(*token_asset_id1))
        .call_params(CallParameters::new(
            Some(amount_expected.value.amount),
            Some(token_asset_id2.clone()),
            Some(100_000_000),
        ))
        .unwrap()
        .tx_params(TxParameters {
            gas_price: 0,
            gas_limit: 100_000_000,
            maturity: 0,
        })
        .simulate()
        .await
        .unwrap();
    assert_eq!(add_liquidity_preview.value.lp_token_received, 99);

    let lp_amount_received = deposit_and_add_liquidity(
        &exchange_instance,
        token_asset_id1,
        native_amount_deposit,
        token_asset_id2,
        add_liquidity_preview.value.token_amount
    )
    .await
        + lp_amount_received;
    // The amount of tokens returned should be smaller
    // as swaps already happen
    assert_eq!(lp_amount_received, expected_final_lp_amount);

    ////////////////////////////////////////////////////////
    // Remove liquidity and receive assets back
    ////////////////////////////////////////////////////////

    let response = exchange_instance.methods()
        .remove_liquidity(1, 1, 1000)
        .call_params(CallParameters::new(
            Some(lp_amount_received),
            Some(lp_asset_id.clone()),
            Some(100_000_000)
        ))
        .unwrap()
        .tx_params(TxParameters {
            gas_price: 0,
            gas_limit: 100_000_000,
            maturity: 0,
        })
        .append_variable_outputs(2)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value.token_amount_1, remove_liquidity_eth_amount);
    assert_eq!(response.value.token_amount_2, remove_liquidity_token_amount);

    ////////////////////////////////////////////////////////
    // Check contract pool is zero
    ////////////////////////////////////////////////////////

    let pool_info = exchange_instance.methods().get_pool_info().call().await.unwrap();
    assert_eq!(pool_info.value.token_reserve_1, 0);
    assert_eq!(pool_info.value.token_reserve_2, 0);
    assert_eq!(pool_info.value.lp_token_supply, 0);
}
