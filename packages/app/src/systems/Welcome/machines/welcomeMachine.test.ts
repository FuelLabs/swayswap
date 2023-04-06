import { bn } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { WelcomeMachineService } from './welcomeMachine';
import { setAgreement, SWAYSWAP_ASSETS, STEPS, welcomeMachine } from './welcomeMachine';

import { createFuel } from '~/systems/Core/hooks/__mocks__/useWallet';
import { DAI, ETH } from '~/systems/Core/utils/tokenList';
import { faucet } from '~/systems/Faucet/hooks/__mocks__/useFaucet';
import { TokenContractAbi__factory } from '~/types/contracts';

describe('captchaMachine', () => {
  let service: WelcomeMachineService;

  beforeAll(() => {
    setAgreement(false);
  });

  beforeEach(() => {
    service = interpret(
      welcomeMachine
        .withContext({
          acceptAgreement: false,
          balance: bn(),
          current: STEPS[0],
        })
        .withConfig({
          actions: {
            navigateTo: () => {},
            acceptAgreement: () => {},
          },
        })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('Should check if wallet is installed', async () => {
    const state = await waitFor(service, (s) => s.matches('installWallet'));
    expect(state.matches('installWallet')).toBeTruthy();

    service.send('WALLET_DETECTED', {
      value: createFuel(false),
    });

    const state2 = await waitFor(service, (s) => s.matches('connectingWallet'));
    expect(state2.matches('connectingWallet')).toBeTruthy();
  });

  it('Should go to connecting if Wallet is detected', async () => {
    const service2 = interpret(
      welcomeMachine
        .withContext({
          acceptAgreement: false,
          balance: bn(),
          current: STEPS[0],
          fuel: createFuel(false),
        })
        .withConfig({
          actions: {
            navigateTo: () => {},
            acceptAgreement: () => {},
          },
        })
    ).start();
    const state2 = await waitFor(service2, (s) => s.matches('connectingWallet'));
    expect(state2.matches('connectingWallet')).toBeTruthy();
  });

  it('Should connect to wallet', async () => {
    service.send('WALLET_DETECTED', {
      value: createFuel(false),
    });
    await waitFor(service, (s) => s.matches('connectingWallet'));
    service.send('CONNECT');
    await waitFor(service, (s) => s.matches('connectingWallet.connecting'));
    await waitFor(service, (s) => s.matches('fecthingBalance'));
  });

  it('Should ask for faucet', async () => {
    const fuel = createFuel(false);
    service.send('WALLET_DETECTED', {
      value: fuel,
    });
    await waitFor(service, (s) => s.matches('connectingWallet'));
    service.send('CONNECT');
    await waitFor(service, (s) => s.matches('connectingWallet.connecting'));
    await waitFor(service, (s) => s.matches('fecthingBalance'));
    await waitFor(service, (s) => s.matches('fauceting'));
    const account = await fuel.currentAccount();
    const wallet = await fuel.getWallet(account);
    await faucet(wallet);
    service.send('NEXT');
    await waitFor(service, (s) => s.matches('addingAssets'));
  });

  it('Should add assets to wallet', async () => {
    const fuel = createFuel(true);
    const account = await fuel.currentAccount();
    const wallet = await fuel.getWallet(account);
    await faucet(wallet);

    service.send('WALLET_DETECTED', {
      value: fuel,
    });
    await waitFor(service, (s) => s.matches('addingAssets.addAssetsToWallet'));
    service.send('ADD_ASSETS');
    await waitFor(service, (s) => s.matches('addingAssets.addingAssets'));
    await waitFor(service, (s) => s.matches('mintingAssets'));
  });

  it('Should mint assets to wallet', async () => {
    const fuel = createFuel(true);
    const account = await fuel.currentAccount();
    const wallet = await fuel.getWallet(account);
    fuel.addAssets(SWAYSWAP_ASSETS);
    await faucet(wallet);
    service.send('WALLET_DETECTED', {
      value: fuel,
    });
    await waitFor(service, (s) => s.matches('mintingAssets.mintAssets'));
    service.send('MINT_ASSETS');
    await waitFor(service, (s) => s.matches('mintingAssets.mintingAssets'));
    await waitFor(service, (s) => s.matches('acceptAgreement'));
  });

  it('Should accept aggrement', async () => {
    const fuel = createFuel(true);
    const account = await fuel.currentAccount();
    const wallet = await fuel.getWallet(account);
    fuel.addAssets(SWAYSWAP_ASSETS);
    await faucet(wallet);
    const token1 = TokenContractAbi__factory.connect(ETH.assetId, wallet);
    const token2 = TokenContractAbi__factory.connect(DAI.assetId, wallet);
    await token1
      .multiCall([token1.functions.mint(), token2.functions.mint()])
      .txParams({
        gasPrice: 1,
      })
      .call();

    service.send('WALLET_DETECTED', {
      value: fuel,
    });
    await waitFor(service, (s) => s.matches('acceptAgreement'));
    service.send('ACCEPT_AGREEMENT');
    await waitFor(service, (s) => s.matches('finished'));
  });

  it('Should go to finish if all steps are complete', async () => {
    setAgreement(true);
    const fuel = createFuel(true);
    const service2 = interpret(
      welcomeMachine
        .withContext({
          acceptAgreement: true,
          balance: bn(),
          current: STEPS[0],
        })
        .withConfig({
          actions: {
            navigateTo: () => {},
            acceptAgreement: () => true,
          },
        })
    ).start();
    const account = await fuel.currentAccount();
    const wallet = await fuel.getWallet(account);
    fuel.addAssets(SWAYSWAP_ASSETS);
    await faucet(wallet);
    const token1 = TokenContractAbi__factory.connect(ETH.assetId, wallet);
    const token2 = TokenContractAbi__factory.connect(DAI.assetId, wallet);
    await token1
      .multiCall([token1.functions.mint(), token2.functions.mint()])
      .txParams({
        gasPrice: 1,
      })
      .call();

    service2.send('WALLET_DETECTED', {
      value: fuel,
    });

    await waitFor(service2, (s) => s.matches('finished'));
  });
});
