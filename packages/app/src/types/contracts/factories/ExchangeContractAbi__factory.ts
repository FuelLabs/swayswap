/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.35.0
  Forc version: 0.35.3
  Fuel-Core version: 0.17.3
*/

import { Interface, Contract } from 'fuels';
import type { Provider, Account, AbstractAddress } from 'fuels';
import type { ExchangeContractAbi, ExchangeContractAbiInterface } from '../ExchangeContractAbi';

const _abi = {
  types: [
    {
      typeId: 0,
      type: '()',
      components: [],
      typeParameters: null,
    },
    {
      typeId: 1,
      type: 'b256',
      components: null,
      typeParameters: null,
    },
    {
      typeId: 2,
      type: 'bool',
      components: null,
      typeParameters: null,
    },
    {
      typeId: 3,
      type: 'struct ContractId',
      components: [
        {
          name: 'value',
          type: 1,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 4,
      type: 'struct PoolInfo',
      components: [
        {
          name: 'token_reserve1',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'token_reserve2',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'lp_token_supply',
          type: 9,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 5,
      type: 'struct PositionInfo',
      components: [
        {
          name: 'token_amount1',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'token_amount2',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'token_reserve1',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'token_reserve2',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'lp_token_supply',
          type: 9,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 6,
      type: 'struct PreviewAddLiquidityInfo',
      components: [
        {
          name: 'token_amount',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'lp_token_received',
          type: 9,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 7,
      type: 'struct PreviewInfo',
      components: [
        {
          name: 'amount',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'has_liquidity',
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 8,
      type: 'struct RemoveLiquidityInfo',
      components: [
        {
          name: 'token_amount1',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'token_amount2',
          type: 9,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 9,
      type: 'u64',
      components: null,
      typeParameters: null,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: 'min_liquidity',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'deadline',
          type: 9,
          typeArguments: null,
        },
      ],
      name: 'add_liquidity',
      output: {
        name: '',
        type: 9,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
        {
          name: 'payable',
          arguments: [],
        },
      ],
    },
    {
      inputs: [],
      name: 'deposit',
      output: {
        name: '',
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
        {
          name: 'payable',
          arguments: [],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'amount',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'asset_id',
          type: 1,
          typeArguments: null,
        },
      ],
      name: 'get_add_liquidity',
      output: {
        name: '',
        type: 6,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'payable',
          arguments: [],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'asset_id',
          type: 3,
          typeArguments: null,
        },
      ],
      name: 'get_balance',
      output: {
        name: '',
        type: 9,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'get_pool_info',
      output: {
        name: '',
        type: 4,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'amount',
          type: 9,
          typeArguments: null,
        },
      ],
      name: 'get_position',
      output: {
        name: '',
        type: 5,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'amount',
          type: 9,
          typeArguments: null,
        },
      ],
      name: 'get_swap_with_maximum',
      output: {
        name: '',
        type: 7,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
        {
          name: 'payable',
          arguments: [],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'amount',
          type: 9,
          typeArguments: null,
        },
      ],
      name: 'get_swap_with_minimum',
      output: {
        name: '',
        type: 7,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'payable',
          arguments: [],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'min_tokens1',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'min_tokens2',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'deadline',
          type: 9,
          typeArguments: null,
        },
      ],
      name: 'remove_liquidity',
      output: {
        name: '',
        type: 8,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'payable',
          arguments: [],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'amount',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'deadline',
          type: 9,
          typeArguments: null,
        },
      ],
      name: 'swap_with_maximum',
      output: {
        name: '',
        type: 9,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'payable',
          arguments: [],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'min',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'deadline',
          type: 9,
          typeArguments: null,
        },
      ],
      name: 'swap_with_minimum',
      output: {
        name: '',
        type: 9,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'payable',
          arguments: [],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'amount',
          type: 9,
          typeArguments: null,
        },
        {
          name: 'asset_id',
          type: 3,
          typeArguments: null,
        },
      ],
      name: 'withdraw',
      output: {
        name: '',
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: 0,
      loggedType: {
        name: '',
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 1,
      loggedType: {
        name: '',
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 2,
      loggedType: {
        name: '',
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 3,
      loggedType: {
        name: '',
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 4,
      loggedType: {
        name: '',
        type: 9,
        typeArguments: null,
      },
    },
    {
      logId: 5,
      loggedType: {
        name: '',
        type: 9,
        typeArguments: null,
      },
    },
  ],
  messagesTypes: [],
  configurables: [],
};

export class ExchangeContractAbi__factory {
  static readonly abi = _abi;
  static createInterface(): ExchangeContractAbiInterface {
    return new Interface(_abi) as unknown as ExchangeContractAbiInterface;
  }
  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): ExchangeContractAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as ExchangeContractAbi;
  }
}
