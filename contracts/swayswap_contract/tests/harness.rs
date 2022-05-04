use fuel_tx::{Address, Salt};
use fuels::{prelude::*, test_helpers};
use fuels_abigen_macro::abigen;
use std::str::FromStr;

#[tokio::test]
async fn swayswap() {
    // Provider and Wallet
    let (provider, wallet) = test_helpers::setup_test_provider_and_wallet().await;

    /////////////////////////////
    // Load the Swayswap contract
    /////////////////////////////
    abigen!(TestSwayswap, "out/debug/swayswap_contract-abi.json");
    let swayswap_salt = Salt::from([0u8; 32]);
    let swayswap_compiled =
        Contract::load_sway_contract("out/debug/swayswap_contract.bin", swayswap_salt).unwrap();

    // Get the contract ID and a handle to it
    let swayswap_contract_id = Contract::deploy(
        &swayswap_compiled,
        &provider.clone(),
        &wallet.clone(),
        TxParameters::default(),
    )
    .await
    .unwrap();
    
    let swayswap_instance = TestSwayswap::new(
        swayswap_contract_id.to_string(),
        provider.clone(),
        wallet.clone(),
    );

    let token_id = Address::from_str("0x562a05877b940cc69d7a9a71000a0cfdd79e93f783f198de893165278712a480").unwrap();
    let exchange_id = Address::from_str("0x014587212741268ad0b1bc727efce9711dbde69c484a9db38bd83bb1b3017c05").unwrap();
    let token_id_2 = Address::from_str("0x716c345b96f3c17234c73881c40df43d3d492b902a01a062c12e92eeae0284e9").unwrap();
    let exchange_id_2 = Address::from_str("0x1c74b79b2c430e13380f51258434752ef661e6ebbb9d4970688424e0a63b8070").unwrap();

    // Depost some native assets
    let result = swayswap_instance
        .add_exchange_contract(
            *token_id,
            *exchange_id
        )
        .call()
        .await;
    println!("{:?}", result);
    let result = swayswap_instance
        .add_exchange_contract(
            *token_id_2,
            *exchange_id_2
        )
        .call()
        .await;
    println!("{:?}", result);
    
    let result = swayswap_instance
        .get_exchange_contract(*token_id)
        .call()
        .await
        .unwrap();
    assert_eq!(result.value, *exchange_id);
    
    let result = swayswap_instance
        .get_exchange_contract(*token_id_2)
        .call()
        .await
        .unwrap();
    assert_eq!(result.value, *exchange_id_2);
}
