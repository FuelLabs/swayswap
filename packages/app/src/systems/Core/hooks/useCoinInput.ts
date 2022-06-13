import type { ReactNode } from 'react';
import { useMemo, useEffect, useState } from 'react';
import type { NumberFormatValues } from 'react-number-format';

import { COIN_ETH, formatUnits, MAX_U64_VALUE, parseInputValueBigInt, ZERO } from '../utils';

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
  showBalance?: boolean;
  showMaxButton?: boolean;
  onChangeCoin?: (coin: Coin) => void;
  disableWhenEth?: boolean;
};

export type UseCoinInput = {
  amount: Maybe<bigint>;
  setAmount: React.Dispatch<React.SetStateAction<Maybe<bigint>>>;
  setGasFee: React.Dispatch<React.SetStateAction<Maybe<bigint>>>;
  getInputProps: () => CoinInputProps;
  getCoinSelectorProps: () => CoinSelectorProps;
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
    isAllowed?: (values: NumberFormatValues) => boolean;
    onChange?: (val: string) => void;
  };

export type CoinSelectorProps = {
  coin?: Maybe<Coin>;
  isReadOnly?: boolean;
  showBalance?: boolean;
  showMaxButton?: boolean;
  onChange?: (coin: Coin) => void;
  onSetMaxBalance?: () => void;
  tooltip?: ReactNode;
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
  showBalance,
  showMaxButton,
  onChangeCoin,
  disableWhenEth,
  ...params
}: UseCoinParams): UseCoinInput {
  const [amount, setAmount] = useState<Maybe<bigint>>(null);
  const [gasFee, setGasFee] = useState<Maybe<bigint>>(initialGasFee || ZERO);
  const { data: balances } = useBalances();
  const coinBalance = balances?.find((item) => item.assetId === coin?.assetId);
  const isEth = useMemo(() => coin?.assetId === COIN_ETH, [coin?.assetId]);

  useEffect(() => {
    if (initialGasFee) setGasFee(initialGasFee);
  }, [initialGasFee]);

  // TODO: consider real gas fee, replacing GAS_FEE variable.
  // For now we need to keep 1 unit in the wallet(it's not spent) in order to complete "create pool" transaction.
  function getSafeMaxBalance() {
    const next = coinBalance?.amount || ZERO;
    const value = next > ZERO ? next - (gasFee || ZERO) : next;
    if (value < ZERO) return ZERO;
    return value;
  }

  const handleInputPropsChange = (val: string) => {
    if (isReadOnly) return;
    const next = val !== '' ? parseInputValueBigInt(val) : null;
    if (typeof onChange === 'function') {
      onChange(next);
    } else {
      setAmount(next);
    }
  };

  const isAllowed = ({ value }: NumberFormatValues) => {
    return parseInputValueBigInt(value) <= MAX_U64_VALUE;
  };

  function getInputProps() {
    return {
      ...params,
      value: formatValue(amount),
      displayType: (isReadOnly ? 'text' : 'input') as DisplayType,
      onInput,
      onChange: handleInputPropsChange,
      balance: formatValue(coinBalance?.amount || ZERO),
      isAllowed,
    } as CoinInputProps;
  }

  function getCoinSelectorProps() {
    return {
      coin,
      isReadOnly,
      showBalance,
      showMaxButton,
      onChange: onChangeCoin,
      onSetMaxBalance: () => {
        onInput?.();
        handleInputPropsChange(formatValue(getSafeMaxBalance()));
      },
      ...(disableWhenEth &&
        isEth && {
          isReadOnly: true,
          tooltip: 'Currently, we only support ETH to TOKEN.',
        }),
    } as CoinSelectorProps;
  }

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
    formatted: formatValue(amount),
    hasEnoughBalance: getSafeMaxBalance() >= (amount || ZERO),
  };
}
