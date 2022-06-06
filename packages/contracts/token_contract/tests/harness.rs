use fuel_tx::{AssetId, ContractId};
use fuels::prelude::*;
use fuels_abigen_macro::abigen;

///////////////////////////////
// Load the Token Contract abi
///////////////////////////////
abigen!(
    TestToken,
    "../token_contract/out/debug/token_contract-abi.json"
);

#[tokio::test]
async fn token_contract() {
    // default initial amount 1000000000
    let wallet = launch_provider_and_get_single_wallet().await;

    ////////////////////////////////////////////////////////
    // Setup contracts
    ////////////////////////////////////////////////////////

    let token_contract_id = Contract::deploy(
        "../token_contract/out/debug/token_contract.bin",
        &wallet,
        TxParameters::default(),
    )
    .await
    .unwrap();
    let token_instance = TestToken::new(token_contract_id.to_string(), wallet.clone());

    ////////////////////////////////////////////////////////
    // Test Token Contract
    ////////////////////////////////////////////////////////

    // Get the contract ID and a handle to it
    let token_mint_amount = 10000;
    // Amount of tokens given to the wallet
    let wallet_token_amount = 1000;

    // Mint some alt tokens
    token_instance
        .mint_coins(token_mint_amount)
        .call()
        .await
        .unwrap();

    // Check the balance of the contract of its own asset
    let result = token_instance.get_balance().call().await.unwrap();
    assert_eq!(result.value, token_mint_amount);

    // Transfer some alt tokens to the wallet
    let address = wallet.address();
    token_instance
        .transfer_coins(wallet_token_amount, address.clone())
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    // Check the balance of the contract of its own asset
    let result = token_instance.get_balance().call().await.unwrap();
    assert_eq!(result.value, token_mint_amount - wallet_token_amount);

    // Inspect the wallet for alt tokens
    let alt_token_id = AssetId::from(*token_contract_id.clone());
    let coins = wallet
        .get_spendable_coins(&alt_token_id, wallet_token_amount)
        .await
        .unwrap();
    assert_eq!(coins[0].amount, wallet_token_amount.into());

    ////////////////////////////////////////////////////////
    // Deposit and transfer ETH on the contract
    ////////////////////////////////////////////////////////

    let wallet_native_balance_before = wallet
        .get_asset_balance(&NATIVE_ASSET_ID)
        .await
        .unwrap();
    let send_native_token_amount = 100;

    // Send native tokens to the contract
    let contract_native_token_balance = token_instance
        .get_token_balance(ContractId::from(*NATIVE_ASSET_ID))
        .call_params(CallParameters::new(
            Some(send_native_token_amount),
            None,
        ))
        .call()
        .await
        .unwrap();
    assert_eq!(contract_native_token_balance.value, send_native_token_amount);

    // Check user balance didn't has the sent native tokens
    let wallet_native_balance_after = wallet
        .get_asset_balance(&NATIVE_ASSET_ID)
        .await
        .unwrap();
    assert_eq!(wallet_native_balance_after, wallet_native_balance_before - send_native_token_amount);

    // Transfer coins back to the wallet from the contract
    token_instance
        .transfer_token_to_output(
            send_native_token_amount,
            ContractId::from(*NATIVE_ASSET_ID),
            wallet.address()
        )
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    let wallet_native_balance_after = wallet
        .get_asset_balance(&NATIVE_ASSET_ID)
        .await
        .unwrap();
    assert_eq!(wallet_native_balance_before, wallet_native_balance_after);
}
