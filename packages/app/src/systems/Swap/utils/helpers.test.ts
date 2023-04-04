import { bn } from 'fuels';

import { SwapDirection } from '../types';

import { calculateMaxBalanceToSwap } from './helpers';

import { TOKENS } from '~/systems/Core';

const TX_COST = {
  byte: bn(1000),
  fee: bn(2),
  gas: bn(704176),
  total: bn(705176),
};

const CTX_FROM_ETH_TO_DAI = {
  coinFrom: TOKENS[0],
  coinTo: TOKENS[1],
  coinFromBalance: bn(399999990),
  coinToBalance: bn(119567935145),
  txCost: TX_COST,
};

const CTX_FROM_DAI_TO_ETH = {
  coinFrom: TOKENS[1],
  coinTo: TOKENS[0],
  coinFromBalance: bn(119567935145),
  coinToBalance: bn(399999990),
  txCost: TX_COST,
};

describe('Swap Helpers', () => {
  describe('calculateMaxBalanceToSwap', () => {
    it('should not discount network fee from BTC balance when BTC is from coin', () => {
      const maxBalanceToSwap = calculateMaxBalanceToSwap({
        direction: SwapDirection.fromTo,
        ctx: CTX_FROM_ETH_TO_DAI,
      });

      expect(maxBalanceToSwap.value).toEqual('0.399999990');
    });

    it('should not discount network fee from BTC balance when BTC is to coin', () => {
      const maxBalanceToSwap = calculateMaxBalanceToSwap({
        direction: SwapDirection.toFrom,
        ctx: CTX_FROM_DAI_TO_ETH,
      });

      expect(maxBalanceToSwap.value).toEqual('0.399999990');
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
