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
import type { TokenContractAbi, TokenContractAbiInterface } from '../TokenContractAbi';

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
      type: 'enum Error',
      components: [
        {
          name: 'AddressAlreadyMint',
          type: 0,
          typeArguments: null,
        },
        {
          name: 'CannotReinitialize',
          type: 0,
          typeArguments: null,
        },
        {
          name: 'MintIsClosed',
          type: 0,
          typeArguments: null,
        },
        {
          name: 'NotOwner',
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 4,
      type: 'struct Address',
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
      typeId: 5,
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
      typeId: 6,
      type: 'u64',
      components: null,
      typeParameters: null,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: 'burn_amount',
          type: 6,
          typeArguments: null,
        },
      ],
      name: 'burn_coins',
      output: {
        name: '',
        type: 0,
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
      name: 'get_balance',
      output: {
        name: '',
        type: 6,
        typeArguments: null,
      },
      attributes: null,
    },
    {
      inputs: [],
      name: 'get_mint_amount',
      output: {
        name: '',
        type: 6,
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
          name: 'asset_id',
          type: 5,
          typeArguments: null,
        },
      ],
      name: 'get_token_balance',
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
      ],
    },
    {
      inputs: [
        {
          name: 'address',
          type: 4,
          typeArguments: null,
        },
      ],
      name: 'has_mint',
      output: {
        name: '',
        type: 2,
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
          name: 'mint_amount',
          type: 6,
          typeArguments: null,
        },
        {
          name: 'address',
          type: 4,
          typeArguments: null,
        },
      ],
      name: 'initialize',
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
    {
      inputs: [],
      name: 'mint',
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
    {
      inputs: [
        {
          name: 'mint_amount',
          type: 6,
          typeArguments: null,
        },
      ],
      name: 'mint_coins',
      output: {
        name: '',
        type: 0,
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
          name: 'mint_amount',
          type: 6,
          typeArguments: null,
        },
      ],
      name: 'set_mint_amount',
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
    {
      inputs: [
        {
          name: 'coins',
          type: 6,
          typeArguments: null,
        },
        {
          name: 'address',
          type: 4,
          typeArguments: null,
        },
      ],
      name: 'transfer_coins',
      output: {
        name: '',
        type: 0,
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
          name: 'coins',
          type: 6,
          typeArguments: null,
        },
        {
          name: 'asset_id',
          type: 5,
          typeArguments: null,
        },
        {
          name: 'address',
          type: 4,
          typeArguments: null,
        },
      ],
      name: 'transfer_token_to_output',
      output: {
        name: '',
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: 0,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 1,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 2,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 3,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 4,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 5,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 6,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
    {
      logId: 7,
      loggedType: {
        name: '',
        type: 3,
        typeArguments: [],
      },
    },
  ],
  messagesTypes: [],
  configurables: [],
};

export class TokenContractAbi__factory {
  static readonly abi = _abi;
  static createInterface(): TokenContractAbiInterface {
    return new Interface(_abi) as unknown as TokenContractAbiInterface;
  }
  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): TokenContractAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as TokenContractAbi;
  }
}
