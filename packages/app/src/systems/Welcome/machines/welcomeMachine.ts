import type { Fuel } from '@fuel-wallet/sdk';
import type { BN } from 'fuels';
import { bn } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { handleError, LocalStorageKey } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import { ETH, DAI, ETH_DAI } from '~/systems/Core/utils/tokenList';
import type { Maybe } from '~/types';
import { Pages } from '~/types';
import { TokenContractAbi__factory } from '~/types/contracts';

export const LOCALSTORAGE_WELCOME_KEY = `${LocalStorageKey}fuel--welcomeStep`;
export const LOCALSTORAGE_AGREEMENT_KEY = `${LocalStorageKey}fuel--agreement`;

export const STEPS = [
  { id: 0, path: Pages.welcomeConnect },
  { id: 1, path: Pages.welcomeFaucet },
  { id: 2, path: Pages.welcomeAddAssets },
  { id: 3, path: Pages.welcomeMint },
  { id: 4, path: Pages.welcomeTerms },
  { id: 5, path: null },
];

export const SWAYSWAP_ASSETS = [
  {
    assetId: ETH.assetId,
    name: 'sEther',
    symbol: 'sETH',
    imageUrl: ETH.img,
    isCustom: true,
  },
  {
    assetId: DAI.assetId,
    name: 'Dai',
    symbol: 'Dai',
    imageUrl: DAI.img,
    isCustom: true,
  },
  {
    assetId: ETH_DAI.assetId,
    name: ETH_DAI.name,
    symbol: ETH_DAI.symbol,
    imageUrl: ETH_DAI.img,
    isCustom: true,
  },
];

export function getAgreement() {
  return localStorage.getItem(LOCALSTORAGE_AGREEMENT_KEY) === 'true';
}

export function setAgreement(accept: boolean) {
  localStorage.setItem(LOCALSTORAGE_AGREEMENT_KEY, String(accept));
}

export function setCurrent(id: number) {
  const current = STEPS[id];
  return current;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignCurrent(id: number): any {
  return assign({
    current: (_) => {
      return STEPS[id];
    },
  });
}

// ----------------------------------------------------------------------------
// State Machine
// ----------------------------------------------------------------------------

export type Step = {
  id: number;
  path: Maybe<string>;
};

type MachineContext = {
  fuel?: Fuel;
  current: Step;
  acceptAgreement: boolean;
  balance: BN;
};

type MachineEvents =
  | { type: 'NEXT' }
  | { type: 'SET_CURRENT'; value: number }
  | { type: 'WALLET_DETECTED'; value: Fuel }
  | { type: 'ADD_ASSETS' }
  | { type: 'MINT_ASSETS' }
  | { type: 'ACCEPT_AGREEMENT' }
  | { type: 'CONNECT' };

type MachineServices = {
  fetchBalance: {
    data: BN;
  };
  addAssets: {
    data: void;
  };
  mintAssets: {
    data: void;
  };
  fetchMintConditions: {
    data: boolean[];
  };
  fetchAssets: {
    data: Array<string>;
  };
};

export type CreateWelcomeMachineConfig = {
  context?: Partial<MachineContext>;
  actions?: {
    navigateTo: (ctx: MachineContext) => void;
    acceptAgreement: (ctx: MachineContext) => void;
  };
};

export const welcomeMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./welcomeMachine.typegen').Typegen0,
    id: 'welcomeSteps',
    predictableActionArguments: true,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
      services: {} as MachineServices,
    },
    context: {
      current: STEPS[0],
      acceptAgreement: getAgreement(),
      balance: bn(),
    },
    initial: 'installWallet',
    states: {
      installWallet: {
        entry: [assignCurrent(0), 'navigateTo'],
        always: [
          {
            cond: (ctx) => !!ctx.fuel,
            target: 'connectingWallet',
          },
        ],
        on: {
          WALLET_DETECTED: {
            actions: ['assignFuel'],
            target: 'connectingWallet',
          },
        },
      },
      connectingWallet: {
        entry: [assignCurrent(0), 'navigateTo'],
        initial: 'fetchingConnection',
        states: {
          idle: {
            on: {
              CONNECT: {
                target: 'connecting',
              },
            },
          },
          fetchingConnection: {
            tags: ['isLoading'],
            invoke: {
              src: (ctx) => ctx.fuel!.isConnected(),
              onDone: [
                {
                  cond: (_, ev) => ev.data,
                  target: '#welcomeSteps.fecthingBalance',
                },
                {
                  target: 'idle',
                },
              ],
              onError: {
                actions: ['toastErrorMessage'],
                target: 'idle',
              },
            },
          },
          connecting: {
            tags: ['isLoading'],
            invoke: {
              src: (ctx) => ctx.fuel!.connect(),
              onDone: [
                {
                  cond: (_, ev) => ev.data,
                  target: '#welcomeSteps.fecthingBalance',
                },
                {
                  target: 'idle',
                },
              ],
              onError: {
                actions: ['toastErrorMessage'],
                target: 'idle',
              },
            },
          },
        },
      },
      fecthingBalance: {
        tags: ['isLoading'],
        invoke: {
          src: 'fetchBalance',
          onDone: [
            {
              cond: 'hasNoBalance',
              actions: ['assignBalances'],
              target: 'fauceting',
            },
            {
              actions: ['assignBalances'],
              target: 'addingAssets',
            },
          ],
          onError: {
            actions: ['toastErrorMessage'],
          },
        },
      },
      fauceting: {
        entry: [assignCurrent(1), 'navigateTo'],
        on: {
          NEXT: {
            target: '#welcomeSteps.addingAssets',
          },
        },
      },
      addingAssets: {
        entry: [assignCurrent(2), 'navigateTo'],
        initial: 'fetchingConditions',
        states: {
          fetchingConditions: {
            tags: ['isLoading'],
            invoke: {
              src: 'fetchAssets',
              onDone: [
                {
                  cond: 'hasAssets',
                  target: '#welcomeSteps.mintingAssets',
                },
                {
                  target: 'addAssetsToWallet',
                },
              ],
            },
          },
          addAssetsToWallet: {
            on: {
              ADD_ASSETS: {
                target: 'addingAssets',
              },
            },
          },
          addingAssets: {
            tags: ['isLoading'],
            invoke: {
              src: 'addAssets',
              onDone: '#welcomeSteps.mintingAssets',
              onError: {
                actions: ['toastErrorMessage'],
                target: 'addAssetsToWallet',
              },
            },
          },
        },
      },
      mintingAssets: {
        entry: [assignCurrent(3), 'navigateTo'],
        initial: 'fetchingMintConditions',
        states: {
          fetchingMintConditions: {
            tags: ['isLoading'],
            invoke: {
              src: 'fetchMintConditions',
              onDone: [
                {
                  cond: 'hasMintedAssets',
                  target: '#welcomeSteps.acceptAgreement',
                },
                {
                  target: 'mintAssets',
                },
              ],
            },
          },
          mintAssets: {
            on: {
              MINT_ASSETS: {
                target: 'mintingAssets',
              },
            },
          },
          mintingAssets: {
            tags: ['isLoading'],
            invoke: {
              src: 'mintAssets',
              onDone: '#welcomeSteps.acceptAgreement',
              onError: {
                actions: ['toastErrorMessage'],
                target: 'mintAssets',
              },
            },
          },
        },
      },
      acceptAgreement: {
        entry: [assignCurrent(4), 'navigateTo'],
        always: [
          {
            cond: (ctx) => ctx.acceptAgreement,
            target: 'finished',
          },
        ],
        on: {
          ACCEPT_AGREEMENT: {
            actions: ['acceptAgreement'],
            target: 'finished',
          },
        },
      },
      finished: {
        entry: [assignCurrent(5), 'navigateTo'],
        type: 'final',
      },
    },
  },
  {
    actions: {
      assignBalances: assign({
        balance: (_, ev) => ev.data,
      }),
      toastErrorMessage(_, ev) {
        handleError(ev.data);
        // eslint-disable-next-line no-console
        console.error(ev.data);
      },
      assignFuel: assign({
        fuel: (_, ev) => ev.value,
      }),
      navigateTo: () => {},
      acceptAgreement: assign({
        acceptAgreement: () => {
          setAgreement(true);
          return true;
        },
      }),
    },
    guards: {
      hasNoBalance: (_, ev) => bn(ev.data).isZero(),
      hasAssets: (_, ev) => {
        const items = SWAYSWAP_ASSETS.filter((a) => ev.data.includes(a.assetId));
        return items.length === SWAYSWAP_ASSETS.length;
      },
      hasMintedAssets: (_, ev) => {
        const items = ev.data.filter((i) => i);
        // 2 is the number of assets that can be minted sETH and DAI
        return items.length === 2;
      },
    },
    services: {
      fetchBalance: async (ctx) => {
        if (!ctx.fuel) {
          throw new Error('Fuel Wallet is not detected!');
        }
        const [address] = await ctx.fuel.accounts();
        if (!address) {
          throw Error('No account found!');
        }
        const wallet = await ctx.fuel.getWallet(address);
        const balance = await wallet.getBalance();
        return balance;
      },
      fetchAssets: async (ctx) => {
        if (!ctx.fuel) {
          throw new Error('Fuel Wallet is not detected!');
        }
        const assetsOnWallet = await ctx.fuel.assets();
        const assetsOnWalletIds = assetsOnWallet.map((a) => a.assetId);
        return assetsOnWalletIds;
      },
      addAssets: async (ctx) => {
        if (!ctx.fuel) {
          throw new Error('Fuel Wallet is not detected!');
        }
        const assetsOnWallet = await ctx.fuel.assets();
        const assetsOnWalletIds = assetsOnWallet.map((a) => a.assetId);
        const assets = SWAYSWAP_ASSETS.filter((a) => !assetsOnWalletIds.includes(a.assetId));
        if (assets.length !== 0) {
          await ctx.fuel.addAssets(assets);
        }
      },
      fetchMintConditions: async (ctx) => {
        if (!ctx.fuel) {
          throw new Error('Fuel Wallet is not detected!');
        }
        const [address] = await ctx.fuel.accounts();
        if (!address) {
          throw Error('No account found!');
        }
        const wallet = await ctx.fuel.getWallet(address);
        const token1 = TokenContractAbi__factory.connect(ETH.assetId, wallet);
        const token2 = TokenContractAbi__factory.connect(DAI.assetId, wallet);
        const addressId = {
          value: wallet.address.toHexString(),
        };

        const { value: hasMint1 } = await token1.functions.has_mint(addressId).get();
        const { value: hasMint2 } = await token2.functions.has_mint(addressId).get();

        return [hasMint1, hasMint2];
      },
      mintAssets: async (ctx) => {
        if (!ctx.fuel) {
          throw new Error('Fuel Wallet is not detected!');
        }
        const [address] = await ctx.fuel.accounts();
        if (!address) {
          throw Error('No account found!');
        }
        const wallet = await ctx.fuel.getWallet(address);
        const token1 = TokenContractAbi__factory.connect(ETH.assetId, wallet);
        const token2 = TokenContractAbi__factory.connect(DAI.assetId, wallet);
        const calls = [];

        const addressId = {
          value: wallet.address.toHexString(),
        };
        const { value: hasMint1 } = await token1.functions.has_mint(addressId).get();
        if (!hasMint1) {
          calls.push(token1.functions.mint());
        }
        const { value: hasMint2 } = await token2.functions.has_mint(addressId).get();
        if (!hasMint2) {
          calls.push(token2.functions.mint());
        }

        if (calls.length === 0) {
          return;
        }

        await token1.multiCall(calls).txParams(getOverrides()).call();
      },
    },
  }
);

export type WelcomeMachine = typeof welcomeMachine;
export type WelcomeMachineService = InterpreterFrom<WelcomeMachine>;
export type WelcomeMachineState = StateFrom<WelcomeMachine>;
export type WelcomeMachineContext = {
  state: StateFrom<WelcomeMachine>;
  send: WelcomeMachineService['send'];
  service: WelcomeMachineService;
  next: () => void;
};
