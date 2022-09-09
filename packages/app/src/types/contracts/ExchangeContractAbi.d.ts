/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type {
  Interface,
  FunctionFragment,
  DecodedValue,
  Contract,
  BytesLike,
  BigNumberish,
  InvokeFunction,
  BN,
} from 'fuels';

export type ContractIdInput = { value: string };

export type ContractIdOutput = { value: string };

export type PoolInfoInput = {
  eth_reserve: BigNumberish;
  token_reserve: BigNumberish;
  lp_token_supply: BigNumberish;
};

export type PoolInfoOutput = {
  eth_reserve: BN;
  token_reserve: BN;
  lp_token_supply: BN;
};

export type RemoveLiquidityInfoInput = {
  eth_amount: BigNumberish;
  token_amount: BigNumberish;
};

export type RemoveLiquidityInfoOutput = { eth_amount: BN; token_amount: BN };

export type PreviewInfoInput = { amount: BigNumberish; has_liquidity: boolean };

export type PreviewInfoOutput = { amount: BN; has_liquidity: boolean };

interface ExchangeContractAbiInterface extends Interface {
  functions: {
    get_balance: FunctionFragment;
    get_pool_info: FunctionFragment;
    get_add_liquidity_token_amount: FunctionFragment;
    deposit: FunctionFragment;
    withdraw: FunctionFragment;
    add_liquidity: FunctionFragment;
    remove_liquidity: FunctionFragment;
    swap_with_minimum: FunctionFragment;
    swap_with_maximum: FunctionFragment;
    get_swap_with_minimum: FunctionFragment;
    get_swap_with_maximum: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'get_balance', values: [ContractIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_pool_info', values?: undefined): Uint8Array;
  encodeFunctionData(
    functionFragment: 'get_add_liquidity_token_amount',
    values: [BigNumberish]
  ): Uint8Array;
  encodeFunctionData(functionFragment: 'deposit', values?: undefined): Uint8Array;
  encodeFunctionData(
    functionFragment: 'withdraw',
    values: [BigNumberish, ContractIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'add_liquidity',
    values: [BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'remove_liquidity',
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'swap_with_minimum',
    values: [BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'swap_with_maximum',
    values: [BigNumberish, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(functionFragment: 'get_swap_with_minimum', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_swap_with_maximum', values: [BigNumberish]): Uint8Array;

  decodeFunctionData(functionFragment: 'get_balance', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_pool_info', data: BytesLike): DecodedValue;
  decodeFunctionData(
    functionFragment: 'get_add_liquidity_token_amount',
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(functionFragment: 'deposit', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'withdraw', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'add_liquidity', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'remove_liquidity', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'swap_with_minimum', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'swap_with_maximum', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_swap_with_minimum', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_swap_with_maximum', data: BytesLike): DecodedValue;
}

export class ExchangeContractAbi extends Contract {
  interface: ExchangeContractAbiInterface;
  functions: {
    get_balance: InvokeFunction<[asset_id: ContractIdInput], BN>;

    get_pool_info: InvokeFunction<[], PoolInfoOutput>;

    get_add_liquidity_token_amount: InvokeFunction<[eth_amount: BigNumberish], BN>;

    deposit: InvokeFunction<[], void>;

    withdraw: InvokeFunction<[amount: BigNumberish, asset_id: ContractIdInput], void>;

    add_liquidity: InvokeFunction<[min_liquidity: BigNumberish, deadline: BigNumberish], BN>;

    remove_liquidity: InvokeFunction<
      [min_eth: BigNumberish, min_tokens: BigNumberish, deadline: BigNumberish],
      RemoveLiquidityInfoOutput
    >;

    swap_with_minimum: InvokeFunction<[min: BigNumberish, deadline: BigNumberish], BN>;

    swap_with_maximum: InvokeFunction<[amount: BigNumberish, deadline: BigNumberish], BN>;

    get_swap_with_minimum: InvokeFunction<[amount: BigNumberish], PreviewInfoOutput>;

    get_swap_with_maximum: InvokeFunction<[amount: BigNumberish], PreviewInfoOutput>;
  };
}
