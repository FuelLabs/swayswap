use fuels::prelude::*;
use fuels::tx::{AssetId, ContractId};

///////////////////////////////
// Load the Token Contract abi
///////////////////////////////
abigen!(Contract(
    name = "TestToken",
    abi = "out/debug/token_contract-abi.json"
));

#[tokio::test]
async fn token_contract() {
    // default initial amount 1000000000
    let initial_amount = 1000000000;
    let num_wallets = 3;
    let num_coins = 1;
    let config = WalletsConfig::new(Some(num_wallets), Some(num_coins), Some(initial_amount));
    let wallets = launch_custom_provider_and_get_wallets(config, None, None).await;
    let wallet_owner = wallets.get(0).unwrap();
    let wallet_mint1 = wallets.get(1).unwrap();
    let wallet_mint2 = wallets.get(2).unwrap();

    ////////////////////////////////////////////////////////
    // Setup contracts
    ////////////////////////////////////////////////////////

    let token_contract_id = Contract::deploy(
        "out/debug/token_contract.bin",
        wallet_owner,
        DeployConfiguration::default(),
    )
    .await
    .unwrap();
    let token_instance = TestToken::new(token_contract_id.clone(), wallet_owner.clone());

    ////////////////////////////////////////////////////////
    // Test Token Contract
    ////////////////////////////////////////////////////////

    // Get the contract ID and a handle to it
    let token_mint_amount = 10000;
    // Amount of tokens given to the wallet
    let wallet_token_amount = 1000;

    // Initialize contract
    token_instance
        .methods()
        .initialize(token_mint_amount, Address::from(wallet_owner.address()))
        .call()
        .await
        .unwrap();
    
    // Contract can be initialized only once
    let is_error = token_instance
        .methods()
        .initialize(token_mint_amount, Address::from(wallet_owner.address()))
        .call()
        .await
        .is_err();
    assert!(is_error);

    // Verify the mint amount
    let mint_amount_contract = token_instance.methods()
        .get_mint_amount()
        .call()
        .await
        .unwrap();
    assert_eq!(mint_amount_contract.value, token_mint_amount);

    // Verify update mint amount
    token_instance.methods()
        .set_mint_amount(1)
        .call()
        .await
        .unwrap();
    let mint_amount_contract = token_instance.methods()
        .get_mint_amount()
        .call()
        .await
        .unwrap();
    assert_eq!(mint_amount_contract.value, 1);

    // Update mint amount to the original value
    token_instance.methods()
        .set_mint_amount(token_mint_amount)
        .call()
        .await
        .unwrap();

    // Mint some alt tokens
    token_instance.methods()
        .mint_coins(token_mint_amount)
        .call()
        .await
        .unwrap();

    // Check the balance of the contract of its own asset
    let result = token_instance.methods().get_balance().call().await.unwrap();
    assert_eq!(result.value, token_mint_amount);

    // Transfer tokens to the wallet
    let address = Address::from(wallet_owner.address());
    token_instance.methods()
        .transfer_coins(wallet_token_amount, address.clone())
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    // Check the balance of the contract of its own asset
    let result = token_instance.methods().get_balance().call().await.unwrap();
    let contract_balance = token_mint_amount - wallet_token_amount;
    assert_eq!(result.value, contract_balance);

    // Burn all minted coins
    token_instance.methods()
        .burn_coins(contract_balance)
        .call()
        .await
        .unwrap();

    // Check the balance of the contract of its own asset
    let result = token_instance.methods().get_balance().call().await.unwrap();
    assert_eq!(result.value, 0);

    ////////////////////////////////////////////////////////
    // Test mint and transfer to address
    ////////////////////////////////////////////////////////

    let token_mint1_instance = TestToken::new(token_contract_id.clone(), wallet_mint1.clone());
    // Mint and transfer some alt tokens to the wallet
    let response = token_mint1_instance.methods()
        .mint()
        .append_variable_outputs(1)
        .call()
        .await.unwrap();
    let is_error = token_mint1_instance.methods()
        .mint()
        .append_variable_outputs(1)
        .call()
        .await
        .is_err();
    assert!(is_error);

    // Inspect the wallet for alt tokens
    let alt_token_id = AssetId::from(*token_contract_id.clone().hash());
    let alt_token_balance = wallet_mint1
        .get_asset_balance(&alt_token_id)
        .await
        .unwrap();
    // The wallet shall received the tokens minted
    assert_eq!(alt_token_balance, token_mint_amount);

    //  Other wallet should be able to mint tokens
    let token_mint2_instance = TestToken::new(token_contract_id.clone(), wallet_mint2.clone());
    token_mint2_instance.methods()
        .mint()
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();

    // Inspect the wallet for alt tokens
    let alt_token_balance2 = wallet_mint2
        .get_asset_balance(&alt_token_id)
        .await
        .unwrap();
    // The wallet shall received the tokens minted
    assert_eq!(alt_token_balance2, token_mint_amount);

    // As we mint and transfer the contract balance should be 0
    let result = token_instance.methods().get_balance().call().await.unwrap();
    assert_eq!(result.value, 0);

    ////////////////////////////////////////////////////////
    // Check only owner can call contract
    ////////////////////////////////////////////////////////

    let is_error = token_mint1_instance.methods()
        .burn_coins(1)
        .call()
        .await
        .is_err();
    assert!(is_error);
    let is_error = token_mint1_instance.methods()
        .mint_coins(1)
        .call()
        .await
        .is_err();
    assert!(is_error);
    let is_error = token_mint1_instance.methods()
        .set_mint_amount(1)
        .call()
        .await
        .is_err();
    assert!(is_error);
    let is_error = token_mint1_instance.methods()
        .transfer_token_to_output(1, ContractId::from(token_contract_id), Address::from(wallet_mint2.address()))
        .call()
        .await
        .is_err();
    assert!(is_error);

    ////////////////////////////////////////////////////////
    // Deposit and transfer ETH on the contract
    ////////////////////////////////////////////////////////

    let wallet_native_balance_before = wallet_owner
        .get_asset_balance(&BASE_ASSET_ID)
        .await
        .unwrap();
    let send_native_token_amount = 100;

    // Send native tokens to the contract
    let contract_native_token_balance = token_instance.methods()
        .get_token_balance(ContractId::from(*BASE_ASSET_ID))
        .call_params(CallParameters::new(
            send_native_token_amount,
            BASE_ASSET_ID,
            100_000_000,
        )).unwrap()
        .call()
        .await
        .unwrap();
    assert_eq!(contract_native_token_balance.value, send_native_token_amount);

    // Check user balance didn't has the sent native tokens
    let wallet_native_balance_after = wallet_owner
        .get_asset_balance(&BASE_ASSET_ID)
        .await
        .unwrap();
    assert_eq!(wallet_native_balance_after, wallet_native_balance_before - send_native_token_amount);

    // Transfer coins back to the wallet from the contract
    token_instance.methods()
        .transfer_token_to_output(
            send_native_token_amount,
            ContractId::from(*BASE_ASSET_ID),
            Address::from(wallet_owner.address())
        )
        .append_variable_outputs(1)
        .call()
        .await
        .unwrap();
    let wallet_native_balance_after = wallet_owner
        .get_asset_balance(&BASE_ASSET_ID)
        .await
        .unwrap();
    assert_eq!(wallet_native_balance_before, wallet_native_balance_after);
}
