/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FuelWalletConnection } from '@fuel-wallet/sdk';
import { FuelWalletLocked, FuelWalletProvider, BaseConnection } from '@fuel-wallet/sdk';
import EventEmitter from 'events';
import type { AbstractAddress } from 'fuels';
import { transactionRequestify, Wallet, Address } from 'fuels';

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

  async accounts() {
    return [userWallet.address.toAddress()];
  }

  async signMessage(params: { account: string; message: string; address: string }) {
    return userWallet.signMessage(params.message);
  }

  async sendTransaction(params: { address: string; transaction: string; message: string }) {
    const transactionInput = params.transaction ? JSON.parse(params.transaction) : params;
    const transaction = transactionRequestify(transactionInput);
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
}

global.window = {
  addEventListener(event: string, cb: any) {
    events.on(event, cb);
  },
  postMessage(message: any): void {
    events.emit('request', message);
  },
} as any;
