use fuel_tx::{AssetId, ContractId};
use fuels::prelude::*;
use fuels_abigen_macro::abigen;

///////////////////////////////
// Load the Exchange Contract abi
///////////////////////////////
abigen!(TestExchange, "out/debug/exchange_contract-abi.json");

///////////////////////////////
// Load the Token Contract abi
///////////////////////////////
abigen!(
    TestToken,
    "../token_contract/out/debug/token_contract-abi.json"
);

#[tokio::test]
async fn exchange_contract() {
    let wallet = launch_provider_and_get_wallet().await;

    // Deploy contract and get ID
    let exchange_contract_id = Contract::deploy(
        "out/debug/exchange_contract.bin",
            &wallet,
            TxParameters::default()
        )
        .await
        .unwrap();
    let exchange_instance = TestExchange::new(
        exchange_contract_id.to_string(),
        wallet.clone()
    );

    // Depost some native assets
    exchange_instance
        .deposit()
        .call_params(CallParameters::new(Some(11), None))
        .call()
        .await
        .unwrap();

    // Native asset id
    let native_asset_id = ContractId::new(*NATIVE_ASSET_ID);

    // Check contract balance
    let response = exchange_instance
        .get_balance(native_asset_id.clone())
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, 11);

    exchange_instance
        .withdraw(11, native_asset_id.clone())
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    
    // Check contract balance
    let response = exchange_instance
        .get_balance(native_asset_id)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, 0);

    // Get the contract ID and a handle to it
    let token_contract_id =
        Contract::deploy(
            "../token_contract/out/debug/token_contract.bin",
            &wallet,
            TxParameters::default()
        )
        .await
        .unwrap();
    let token_instance = TestToken::new(token_contract_id.to_string(), wallet.clone());

    // Mint some alt tokens
    token_instance.mint_coins(10000).call().await.unwrap();

    // Check the balance of the contract of its own asset
    let result = token_instance
        .get_balance(token_contract_id.clone(), token_contract_id.clone())
        .call()
        .await
        .unwrap();
    assert_eq!(result.value, 10000);

    //////////////////////////////////////////
    // Start transferring and adding liquidity
    //////////////////////////////////////////

    // Transfer some alt tokens to the wallet
    let address = wallet.address();
    let _t = token_instance
        .transfer_coins_to_output(50, token_contract_id.clone(), address.clone())
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    // Check the balance of the contract of its own asset
    let result = token_instance
        .get_balance(token_contract_id.clone(), token_contract_id.clone())
        .call()
        .await
        .unwrap();
    assert_eq!(result.value, 10000 - 50);

    let alt_token_id = AssetId::from(*token_contract_id.clone());
    let lp_token_id = AssetId::from(*exchange_contract_id.clone());

    // Inspect the wallet for alt tokens
    let coins = wallet
        .get_spendable_coins(&alt_token_id, 50)
        .await
        .unwrap();
    assert_eq!(coins[0].amount, 50u64.into());

    // Deposit 50 native assets
    exchange_instance
        .deposit()
        .call_params(CallParameters::new(Some(50), None))
        .call()
        .await
        .unwrap();

    // deposit 50 alt tokens into the Exchange contract
    exchange_instance
        .deposit()
        .call_params(CallParameters::new(
            Some(50),
            Some(alt_token_id.clone()),
        ))
        .call()
        .await
        .unwrap();

    // Add initial liquidity, setting proportion 1:1
    // where lp tokens returned should be equal to the eth_amount deposited 50
    exchange_instance
        .add_liquidity(1, 50, 1000)
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    // Check LP tokens amount to be 50
    assert_eq!(
        wallet
            .get_spendable_coins(&lp_token_id, 50)
            .await
            .unwrap()[0]
            .amount,
        50u64.into()
    );

    // Fund the wallet again with some alt tokens
    token_instance
        .transfer_coins_to_output(100, token_contract_id.clone(), address.clone())
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    // Deposit 100 native assets
    exchange_instance
        .deposit()
        .call_params(CallParameters::new(Some(100), None))
        .call()
        .await
        .unwrap();

    // Deposit 100 alt tokens
    exchange_instance
        .deposit()
        .call_params(CallParameters::new(
            Some(100),
            Some(alt_token_id.clone()),
        ))
        .call()
        .await
        .unwrap();

    // Add liquidity for the second time. Keeping the proportion 1:1
    // It should return the same amount of LP as the amount of ETH deposited
    let result = exchange_instance
        .add_liquidity(1, 100, 1000)
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(result.value, 100);

    // Inspect the wallet for LP tokens - should see 50 LP tokens + 100 LP tokens
    let lp_tokens = wallet
        .get_spendable_coins(&lp_token_id, 150)
        .await
        .unwrap();
    assert!(
        (lp_tokens[0].amount == 50u64.into()) && (lp_tokens[1].amount == 100u64.into())
        || (lp_tokens[0].amount == 100u64.into()) && (lp_tokens[1].amount == 50u64.into())
    );

    ///////////////////
    // Remove liquidity
    ///////////////////
    // Remove 40 LP tokens from liquidity it should keep proportion 1:1
    // And return 40 native tokens and 40 alt tokens
    let result = exchange_instance
        .remove_liquidity(50, 50, 1000)
        .call_params(CallParameters::new(
            Some(50),
            Some(lp_token_id.clone()),
        ))
        .append_variable_outputs(2)
        .call()
        .await
        .unwrap();
    assert_eq!(result.value.eth_amount, 50);
    assert_eq!(result.value.token_amount, 50);
    
    // Inspect the wallet for LP tokens
    // It should have 100 lp tokens)
    let spendable_coins = wallet
        .get_spendable_coins(&lp_token_id, 100)
        .await
        .unwrap();
    let total_amount: u64 = spendable_coins.iter().map(|c| c.amount.0).sum();

    // Inspect the wallet for alt tokens to be 100
    assert_eq!(total_amount, 100);

    ////////////////////
    // SWAP WITH MINIMUM
    ////////////////////
    
    let amount: u64 = 10;

    // ETH -> TOKEN
    let amount_expected = exchange_instance
        .get_swap_with_minimum(amount)
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    let response = exchange_instance
        .swap_with_minimum(amount_expected.value.amount, 1000)
        .call_params(CallParameters::new(Some(amount), None))
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);

    // TOKEN -> ETH
    let amount_expected = exchange_instance
        .get_swap_with_minimum(amount)
        .call_params(CallParameters::new(
            Some(0),
            Some(alt_token_id.clone()),
        ))
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    let response = exchange_instance
        .swap_with_minimum(amount_expected.value.amount, 1000)
        .call_params(CallParameters::new(
            Some(amount),
            Some(alt_token_id.clone()),
        ))
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);
   
    ////////////////////
    // SWAP WITH MAXIMUM
    ////////////////////
    
    // Should return u64::MAX
    // If the output is bigger them the reserve
    let amount_expected = exchange_instance
        .get_swap_with_maximum(1000)
        .call()
        .await
        .unwrap();
    assert_eq!(amount_expected.value.amount, u64::MAX);
    // Should return u64::MAX
    // If the output is equal to the reserve
    let amount_expected = exchange_instance
        .get_swap_with_maximum(101)
        .call()
        .await
        .unwrap();
    assert_eq!(amount_expected.value.amount, u64::MAX);
    
    // ETH -> TOKEN
    let amount_expected = exchange_instance
        .get_swap_with_maximum(amount)
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    let response = exchange_instance
        .swap_with_maximum(amount, 1000)
        .call_params(CallParameters::new(Some(amount_expected.value.amount), None))
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);

    // TOKEN -> ETH
    let amount_expected = exchange_instance
        .get_swap_with_maximum(amount)
        .call()
        .await
        .unwrap();
    assert!(amount_expected.value.has_liquidity);
    let response = exchange_instance
        .swap_with_minimum(amount, 1000)
        .call_params(CallParameters::new(
            Some(amount_expected.value.amount),
            Some(alt_token_id.clone()),
        ))
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    assert_eq!(response.value, amount_expected.value.amount);
}
