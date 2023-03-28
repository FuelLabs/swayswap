/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FuelWalletConnection } from '@fuel-wallet/sdk';
import { FuelWalletLocked, FuelWalletProvider, BaseConnection } from '@fuel-wallet/sdk';
import { FuelProviderConfig } from '@fuel-wallet/types';
import EventEmitter from 'events';
import type { AbstractAddress } from 'fuels';
import { transactionRequestify, Wallet, Address } from 'fuels';
import { TransactionRequest } from 'fuels';

import { FUEL_PROVIDER_URL } from '~/config';

const generateOptions = {
  provider: FUEL_PROVIDER_URL,
};
export const userWallet = Wallet.generate(generateOptions);
export const toWallet = Wallet.generate(generateOptions);
const events = new EventEmitter();

export class MockConnection extends BaseConnection {
  isConnectedOverride;
  constructor(isConnected = true) {
    super();
    events.addListener('request', this.onCommunicationMessage.bind(this));
    this.externalMethods([
      this.connect,
      this.disconnect,
      this.isConnected,
      this.accounts,
      this.network,
      this.signMessage,
      this.sendTransaction,
      this.currentAccount,
      this.assets,
      this.addAsset,
      this.addAssets,
    ]);
    this.isConnectedOverride = isConnected;
  }

  static start(isConnectedOverride = true) {
    return new MockConnection(isConnectedOverride);
  }

  async network() {
    return {
      url: FUEL_PROVIDER_URL!,
    };
  }

  async isConnected() {
    return this.isConnectedOverride;
  }

  async connect() {
    return true;
  }

  async disconnect() {
    return false;
  }

  acceptMessage() {
    return true;
  }

  async ping(): Promise<boolean> {
    return true;
  }

  async addAssets(): Promise<boolean> {
    return true;
  }

  async addAsset(): Promise<boolean> {
    return true;
  }

  async assets() {
    const assets = await userWallet.getBalances();
    return assets;
  }

  async onMessage() {}
  async postMessage() {}

  async accounts() {
    return [userWallet.address.toAddress()];
  }

  async signMessage(address: string, message: string) {
    return userWallet.signMessage(message);
  }

  async sendTransaction(
    transaction: TransactionRequest & { signer?: string | undefined },
    providerConfig: FuelProviderConfig,
    signer?: string | undefined
  ) {
    // console.log('tx: ', params.transaction);
    // console.log('params: ', params);
    //const transaction = transactionRequestify(JSON.parse(patransaction));
    const response = await userWallet.sendTransaction(transaction);
    return response.id;
  }

  async currentAccount() {
    return userWallet.address.toAddress();
  }

  async getWallet(address: string | AbstractAddress): Promise<FuelWalletLocked> {
    const provider = new FuelWalletProvider(
      FUEL_PROVIDER_URL,
      this as unknown as FuelWalletConnection
    );
    return new FuelWalletLocked(address, provider);
  }

  async getProvider() {
    const provider = new FuelWalletProvider(
      FUEL_PROVIDER_URL,
      this as unknown as FuelWalletConnection
    );
    return provider;
  }

  readonly utils = {
    // TODO: remove createAddress once fuels-ts replace input
    // class address with string. The warn message is to avoid
    // developers to use this method.
    createAddress: (address: string) => {
      // eslint-disable-next-line no-console
      console.warn('Do not use this method! It will be removed in the next release.');
      return Address.fromString(address);
    },
  };

  // Externalize events names
  readonly events = {
    accounts: 'accounts',
    currentAccount: 'currentAccount',
    connection: 'connection',
    network: 'network',
    assets: 'assets',
  };
  //readonly events = FuelWalletEvents;
}

global.window = {
  addEventListener(event: string, cb: any) {
    events.on(event, cb);
  },
  postMessage(message: any): void {
    events.emit('request', message);
  },
} as any;
