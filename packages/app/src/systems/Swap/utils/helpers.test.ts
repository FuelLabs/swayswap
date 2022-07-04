import { SwapDirection } from '../types';

import { calculateMaxBalanceToSwap } from './helpers';

import { TOKENS } from '~/systems/Core';

const TX_COST = {
  byte: BigInt(1000),
  fee: BigInt(2),
  gas: BigInt(704176),
  total: BigInt(705176),
};

const CTX_FROM_ETH_TO_DAI = {
  coinFrom: TOKENS[0],
  coinTo: TOKENS[1],
  coinFromBalance: BigInt(399999990),
  coinToBalance: BigInt(119567935145),
  txCost: TX_COST,
};

const CTX_FROM_DAI_TO_ETH = {
  coinFrom: TOKENS[1],
  coinTo: TOKENS[0],
  coinFromBalance: BigInt(119567935145),
  coinToBalance: BigInt(399999990),
  txCost: TX_COST,
};

describe('Swap Helpers', () => {
  describe('calculateMaxBalanceToSwap', () => {
    it('should discount network fee from ETH balance when ETH is from coin', () => {
      const maxBalanceToSwap = calculateMaxBalanceToSwap({
        direction: SwapDirection.fromTo,
        ctx: CTX_FROM_ETH_TO_DAI,
      });

      expect(maxBalanceToSwap.value).toEqual('0.399999988');
    });

    it('should discount network fee from ETH balance when ETH is to coin', () => {
      const maxBalanceToSwap = calculateMaxBalanceToSwap({
        direction: SwapDirection.toFrom,
        ctx: CTX_FROM_DAI_TO_ETH,
      });

      expect(maxBalanceToSwap.value).toEqual('0.399999988');
    });

    it('should not discount network fee from DAI balance when DAI is from coin', () => {
      const maxBalanceToSwap = calculateMaxBalanceToSwap({
        direction: SwapDirection.fromTo,
        ctx: CTX_FROM_DAI_TO_ETH,
      });

      expect(maxBalanceToSwap.value).toEqual('119.567935145');
    });

    it('should not discount network fee from DAI balance when DAI is to coin', () => {
      const maxBalanceToSwap = calculateMaxBalanceToSwap({
        direction: SwapDirection.toFrom,
        ctx: CTX_FROM_ETH_TO_DAI,
      });

      expect(maxBalanceToSwap.value).toEqual('119.567935145');
    });
  });
});
