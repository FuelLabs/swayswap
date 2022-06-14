import { useMemo } from "react";

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

export const CoinBalance = ({
  coin,
  showMaxButton = true,
  onSetMaxBalance,
  gasFee,
}: CoinBalanceProps) => {
  const { data: balances } = useBalances({ enabled: true });

  const balance = useMemo(() => {
    const coinBalance = balances?.find(
      (item) => item.assetId === coin?.assetId
    );
    return parseToFormattedNumber(coinBalance?.amount || BigInt(0));
  }, [balances, coin?.assetId]);

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
            aria-label="Set Maximun Balance"
            size="sm"
            onPress={onSetMaxBalance}
            className="text-xs py-0 px-1 h-auto bg-primary-800/60 text-primary-500 hover:bg-primary-800"
            variant="ghost"
          >
            Max
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
