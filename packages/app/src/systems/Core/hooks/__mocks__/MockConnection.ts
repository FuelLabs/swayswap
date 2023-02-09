/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FuelWalletConnection } from '@fuel-wallet/sdk';
import { FuelWalletLocked, FuelWalletProvider, BaseConnection } from '@fuel-wallet/sdk';
import EventEmitter from 'events';
import type { AbstractAddress } from 'fuels';
import { transactionRequestify, Wallet } from 'fuels';

import { FUEL_PROVIDER_URL } from '~/config';

const generateOptions = {
  provider: process.env.PUBLIC_PROVIDER_URL!,
};
export const userWallet = Wallet.generate(generateOptions);
export const toWallet = Wallet.generate(generateOptions);
const events = new EventEmitter();

export class MockConnection extends BaseConnection {
  constructor() {
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
  }

  static start() {
    return new MockConnection();
  }

  async network() {
    return {
      url: process.env.PUBLIC_PROVIDER_URL!,
    };
  }

  async isConnected() {
    return true;
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
}

global.window = {
  addEventListener(event: string, cb: any) {
    events.on(event, cb);
  },
  postMessage(message: any): void {
    events.emit('request', message);
  },
} as any;
