/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { Provider, Wallet } from 'fuels';
import { Interface, Contract } from 'fuels';
import type { Exchange_contractAbi, Exchange_contractAbiInterface } from '../Exchange_contractAbi';
const _abi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'token',
        type: 'struct ContractId',
        components: [
          {
            name: 'value',
            type: 'b256',
            components: null,
          },
        ],
      },
    ],
    name: 'get_balance',
    outputs: [
      {
        name: '',
        type: 'u64',
        components: null,
      },
    ],
  },
  {
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [
      {
        name: '',
        type: '()',
        components: null,
      },
    ],
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'amount',
        type: 'u64',
        components: null,
      },
      {
        name: 'asset_id',
        type: 'struct ContractId',
        components: [
          {
            name: 'value',
            type: 'b256',
            components: null,
          },
        ],
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        name: '',
        type: '()',
        components: null,
      },
    ],
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'min_liquidity',
        type: 'u64',
        components: null,
      },
      {
        name: 'deadline',
        type: 'u64',
        components: null,
      },
    ],
    name: 'add_liquidity',
    outputs: [
      {
        name: '',
        type: 'u64',
        components: null,
      },
    ],
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'min_eth',
        type: 'u64',
        components: null,
      },
      {
        name: 'min_tokens',
        type: 'u64',
        components: null,
      },
      {
        name: 'deadline',
        type: 'u64',
        components: null,
      },
    ],
    name: 'remove_liquidity',
    outputs: [
      {
        name: '',
        type: 'struct RemoveLiquidityReturn',
        components: [
          {
            name: 'eth_amount',
            type: 'u64',
            components: null,
          },
          {
            name: 'token_amount',
            type: 'u64',
            components: null,
          },
        ],
      },
    ],
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'min',
        type: 'u64',
        components: null,
      },
      {
        name: 'deadline',
        type: 'u64',
        components: null,
      },
    ],
    name: 'swap_with_minimum',
    outputs: [
      {
        name: '',
        type: 'u64',
        components: null,
      },
    ],
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'amount',
        type: 'u64',
        components: null,
      },
      {
        name: 'deadline',
        type: 'u64',
        components: null,
      },
    ],
    name: 'swap_with_maximum',
    outputs: [
      {
        name: '',
        type: 'u64',
        components: null,
      },
    ],
  },
  {
    type: 'function',
    inputs: [],
    name: 'get_info',
    outputs: [
      {
        name: '',
        type: 'struct PoolInfo',
        components: [
          {
            name: 'eth_reserve',
            type: 'u64',
            components: null,
          },
          {
            name: 'token_reserve',
            type: 'u64',
            components: null,
          },
          {
            name: 'lp_token_supply',
            type: 'u64',
            components: null,
          },
        ],
      },
    ],
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'amount',
        type: 'u64',
        components: null,
      },
    ],
    name: 'get_swap_with_minimum',
    outputs: [
      {
        name: '',
        type: 'struct PreviewInfo',
        components: [
          {
            name: 'amount',
            type: 'u64',
            components: null,
          },
          {
            name: 'has_liquidity',
            type: 'bool',
            components: null,
          },
        ],
      },
    ],
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'amount',
        type: 'u64',
        components: null,
      },
    ],
    name: 'get_swap_with_maximum',
    outputs: [
      {
        name: '',
        type: 'struct PreviewInfo',
        components: [
          {
            name: 'amount',
            type: 'u64',
            components: null,
          },
          {
            name: 'has_liquidity',
            type: 'bool',
            components: null,
          },
        ],
      },
    ],
  },
];

export class Exchange_contractAbi__factory {
  static readonly abi = _abi;
  static createInterface(): Exchange_contractAbiInterface {
    return new Interface(_abi) as Exchange_contractAbiInterface;
  }
  static connect(id: string, walletOrProvider: Wallet | Provider): Exchange_contractAbi {
    return new Contract(id, _abi, walletOrProvider) as Exchange_contractAbi;
  }
}
