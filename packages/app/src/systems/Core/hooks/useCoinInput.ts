import type { ReactNode } from 'react';
import { useMemo, useEffect, useState } from 'react';
import type { NumberFormatValues } from 'react-number-format';

import {
  formatUnits,
  isCoinEth,
  MAX_U64_VALUE,
  parseInputValueBigInt,
  safeBigInt,
  ZERO,
} from '../utils';

import { useBalances } from './useBalances';

import type { NumberInputProps } from '~/systems/UI';
import type { Coin, Maybe } from '~/types';

export type UseCoinParams = {
  /**
   * Props for <CoinInput />
   */
  amount?: Maybe<bigint>;
  coin?: Maybe<Coin>;
  gasFee?: Maybe<bigint>;
  isReadOnly?: boolean;
  onInput?: (...args: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onChange?: (val: Maybe<bigint>) => void;
  /**
   * Coins for <CoinSelector />
   */
  onChangeCoin?: (coin: Coin) => void;
  disableWhenEth?: boolean;
};

export type UseCoinInput = {
  amount: Maybe<bigint>;
  setAmount: React.Dispatch<React.SetStateAction<Maybe<bigint>>>;
  setGasFee: React.Dispatch<React.SetStateAction<Maybe<bigint>>>;
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
  gasFee?: Maybe<bigint>;
  showBalance?: boolean;
  showMaxButton?: boolean;
  onSetMaxBalance?: () => void;
  isMaxButtonDisabled?: boolean;
};

type DisplayType = 'input' | 'text';

const formatValue = (amount: Maybe<bigint>) => {
  return amount ? formatUnits(amount) : '';
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
  const [amount, setAmount] = useState<Maybe<bigint>>(null);
  const [gasFee, setGasFee] = useState<Maybe<bigint>>(safeBigInt(initialGasFee));
  const { data: balances } = useBalances();
  const coinBalance = balances?.find((item) => item.assetId === coin?.assetId);
  const isEth = useMemo(() => isCoinEth(coin), [coin?.assetId]);

  // TODO: consider real gas fee, replacing GAS_FEE variable.
  // For now we need to keep 1 unit in the wallet(it's not spent) in order to complete "create pool" transaction.
  function getSafeMaxBalance() {
    const next = safeBigInt(coinBalance?.amount);
    const value = next > ZERO ? next - safeBigInt(gasFee) : next;
    if (value < ZERO) return ZERO;
    return value;
  }

  function handleInputPropsChange(val: string) {
    if (isReadOnly) return;
    const next = val !== '' ? parseInputValueBigInt(val) : null;
    if (typeof onChange === 'function') {
      onChange(next);
    } else {
      setAmount(next);
    }
  }

  function isAllowed({ value }: NumberFormatValues) {
    return parseInputValueBigInt(value) <= MAX_U64_VALUE;
  }

  function getInputProps() {
    return {
      ...params,
      value: formatValue(amount),
      displayType: (isReadOnly ? 'text' : 'input') as DisplayType,
      onInput,
      onChange: handleInputPropsChange,
      balance: formatValue(safeBigInt(coinBalance?.amount)),
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
  }, [initialGasFee]);

  useEffect(() => {
    // Enable value initialAmount to be null
    if (initialAmount !== undefined) setAmount(initialAmount);
  }, [initialAmount]);

  return {
    amount,
    setAmount,
    setGasFee,
    getInputProps,
    getCoinSelectorProps,
    getCoinBalanceProps,
    formatted: formatValue(amount),
    hasEnoughBalance: getSafeMaxBalance() >= safeBigInt(amount),
  };
}
