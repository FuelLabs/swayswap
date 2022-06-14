import { forwardRef, useMemo } from "react";

import { useBalances } from "../hooks";
import { parseToFormattedNumber } from "../utils";

import { Button, Tooltip } from "~/systems/UI";
import type { Coin } from "~/types";

export type CoinBalanceProps = {
  coin?: Coin | null;
  showMaxButton?: boolean;
  onSetMaxBalance?: () => void;
  gasFee?: bigint | null;
};

export const CoinBalance = forwardRef<HTMLDivElement, CoinBalanceProps>(
  ({ coin, showMaxButton = true, onSetMaxBalance, gasFee }) => {
    const { data: balances } = useBalances({ enabled: true });
    const coinBalance = balances?.find(
      (item) => item.assetId === coin?.assetId
    );

    const balance = useMemo(
      () => parseToFormattedNumber(coinBalance?.amount || BigInt(0)),
      [coinBalance?.assetId, coinBalance?.amount]
    );

    return (
      <div className="flex items-center justify-end gap-2 mt-2 whitespace-nowrap">
        <div
          className="text-xs text-gray-400"
          aria-label={`${coin?.symbol} balance`}
        >
          Balance: {balance}
        </div>
        {showMaxButton && (
          <Tooltip
            content={`Max = ${balance}(${coin?.symbol} balance)${
              gasFee ? ` - ${parseToFormattedNumber(gasFee)}(network fee)` : ``
            }`}
          >
            <Button
              size="sm"
              onPress={onSetMaxBalance}
              className="coinBalance--maxButton"
              variant="ghost"
            >
              Max
            </Button>
          </Tooltip>
        )}
      </div>
    );
  }
);
