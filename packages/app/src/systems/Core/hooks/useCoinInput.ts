import type { BN, CoinQuantity } from 'fuels';
import { bn } from 'fuels';
import type { ReactNode } from 'react';
import { useMemo, useEffect, useState } from 'react';
import type { NumberFormatValues } from 'react-number-format';

import { isCoinEth, ZERO } from '../utils';

import { useBalances } from './useBalances';

import type { NumberInputProps } from '~/systems/UI';
import type { Coin, Maybe } from '~/types';

export type UseCoinParams = {
  /**
   * Props for <CoinInput />
   */
  max?: Maybe<BN>;
  amount?: Maybe<BN>;
  coin?: Maybe<Coin>;
  gasFee?: Maybe<BN>;
  isReadOnly?: boolean;
  onInput?: (...args: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange?: (val: Maybe<BN>) => void;
  /**
   * Coins for <CoinSelector />
   */
  onChangeCoin?: (coin: Coin) => void;
  disableWhenEth?: boolean;
};

export type UseCoinInput = {
  amount: Maybe<BN>;
  setAmount: (value: Maybe<BN>) => void;
  setGasFee: React.Dispatch<React.SetStateAction<Maybe<BN>>>;
  getInputProps: () => CoinInputProps;
  getCoinSelectorProps: () => CoinSelectorProps;
  getCoinBalanceProps: () => CoinBalanceProps;
  formatted: string;
  hasEnoughBalance: boolean;
};

export type CoinInputProps = Omit<UseCoinParams, 'onChange'> &
  NumberInputProps & {
    value: string;
    displayType: DisplayType;
    autoFocus?: boolean;
    isLoading?: boolean;
    rightElement?: ReactNode;
    bottomElement?: ReactNode;
    isAllowed?: (values: NumberFormatValues) => boolean;
    onChange?: (val: string) => void;
  };

export type CoinSelectorProps = {
  coin?: Maybe<Coin>;
  isReadOnly?: boolean;
  onChange?: (coin: Coin) => void;
  tooltip?: ReactNode;
};

export type CoinBalanceProps = {
  coin?: Maybe<Coin>;
  gasFee?: Maybe<BN>;
  showBalance?: boolean;
  showMaxButton?: boolean;
  onSetMaxBalance?: () => void;
  isMaxButtonDisabled?: boolean;
};

type DisplayType = 'input' | 'text';

const formatValue = (amount: Maybe<BN>) => {
  return amount ? amount.formatUnits() : '';
};

export function useCoinInput({
  amount: initialAmount,
  onChange,
  coin,
  gasFee: initialGasFee,
  isReadOnly,
  onInput,
  onChangeCoin,
  disableWhenEth,
  ...params
}: UseCoinParams): UseCoinInput {
  const [amount, setAmount] = useState<Maybe<BN>>(null);
  const [gasFee, setGasFee] = useState<Maybe<BN>>(bn(initialGasFee));
  const { data: balances } = useBalances();
  const coinBalance = balances?.find((item: CoinQuantity) => item.assetId === coin?.assetId);
  const isEth = useMemo(() => isCoinEth(coin), [coin?.assetId]);

  // TODO: consider real gas fee, replacing GAS_FEE variable.
  // For now we need to keep 1 unit in the wallet(it's not spent) in order to complete "create pool" transaction.
  function getSafeMaxBalance() {
    const next = bn(coinBalance?.amount);
    const value = next > ZERO ? next.sub(bn(gasFee)) : next;
    if (value < ZERO) return ZERO;
    return value;
  }

  function handleInputPropsChange(val: string) {
    if (isReadOnly) return;
    const next = val !== '' ? bn.parseUnits(val) : null;
    if (typeof onChange === 'function') {
      onChange(next);
    } else {
      setAmount(next);
    }
  }

  function isAllowed({ value }: NumberFormatValues) {
    const max = params.max ? params.max : bn(Number.MAX_SAFE_INTEGER);
    return bn.parseUnits(value).lt(max);
  }

  function getInputProps() {
    return {
      ...params,
      value: formatValue(amount),
      displayType: (isReadOnly ? 'text' : 'input') as DisplayType,
      onInput,
      onChange: handleInputPropsChange,
      balance: formatValue(bn(coinBalance?.amount)),
      isAllowed,
    } as CoinInputProps;
  }

  function getCoinSelectorProps() {
    return {
      coin,
      isReadOnly,
      onChange: onChangeCoin,
      onSetMaxBalance: () => {
        onInput?.();
        handleInputPropsChange(formatValue(getSafeMaxBalance()));
      },
      ...(disableWhenEth &&
        isEth && {
          isReadOnly: true,
          tooltip: 'Currently, we only support ETH <-> TOKEN.',
        }),
    } as CoinSelectorProps;
  }

  function getCoinBalanceProps() {
    return {
      coin,
      gasFee,
      onSetMaxBalance: () => {
        onInput?.();
        handleInputPropsChange(formatValue(getSafeMaxBalance()));
      },
    } as CoinBalanceProps;
  }

  useEffect(() => {
    if (initialGasFee) setGasFee(initialGasFee);
  }, [initialGasFee?.toHex()]);

  useEffect(() => {
    // Enable value initialAmount to be null
    if (initialAmount !== undefined) setAmount(initialAmount);
  }, [initialAmount?.toHex()]);

  return {
    amount,
    setAmount,
    setGasFee,
    getInputProps,
    getCoinSelectorProps,
    getCoinBalanceProps,
    formatted: formatValue(amount),
    hasEnoughBalance: getSafeMaxBalance().gte(bn(amount)),
  };
}
