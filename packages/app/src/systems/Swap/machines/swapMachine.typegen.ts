// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    setBalances: 'SET_BALANCES' | 'done.invoke.(machine).fetchingBalances:invocation[0]';
    selectCoin: 'SELECT_COIN';
    invertDirection: 'INVERT_COINS';
    setMaxValue: 'SET_MAX_VALUE';
    setInputValue: 'INPUT_CHANGE';
    clearContext: 'INPUT_CHANGE' | 'done.invoke.(machine).readyToSwap.swapping:invocation[0]';
    toastErrorMessage:
      | 'error.platform.(machine).fetchingBalances:invocation[0]'
      | 'error.platform.(machine).fetchingResources.fetchingTxCost:invocation[0]'
      | 'error.platform.(machine).fetchingResources.fetchingPoolInfo:invocation[0]'
      | 'error.platform.(machine).fetchingResources.fetchingPreview:invocation[0]'
      | 'error.platform.(machine).readyToSwap.swapping:invocation[0]';
    setTxCost: 'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]';
    setPoolInfo: 'done.invoke.(machine).fetchingResources.fetchingPoolInfo:invocation[0]';
    setPreviewInfo: 'done.invoke.(machine).fetchingResources.fetchingPreview:invocation[0]';
    setOppositeValue: 'done.invoke.(machine).fetchingResources.fetchingPreview:invocation[0]';
    setValuesWithSlippage: 'done.invoke.(machine).fetchingResources.fetchingPreview:invocation[0]';
    toastSwapSuccess: 'done.invoke.(machine).readyToSwap.swapping:invocation[0]';
  };
  internalEvents: {
    'done.invoke.(machine).fetchingBalances:invocation[0]': {
      type: 'done.invoke.(machine).fetchingBalances:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.(machine).readyToSwap.swapping:invocation[0]': {
      type: 'done.invoke.(machine).readyToSwap.swapping:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.(machine).fetchingBalances:invocation[0]': {
      type: 'error.platform.(machine).fetchingBalances:invocation[0]';
      data: unknown;
    };
    'error.platform.(machine).fetchingResources.fetchingTxCost:invocation[0]': {
      type: 'error.platform.(machine).fetchingResources.fetchingTxCost:invocation[0]';
      data: unknown;
    };
    'error.platform.(machine).fetchingResources.fetchingPoolInfo:invocation[0]': {
      type: 'error.platform.(machine).fetchingResources.fetchingPoolInfo:invocation[0]';
      data: unknown;
    };
    'error.platform.(machine).fetchingResources.fetchingPreview:invocation[0]': {
      type: 'error.platform.(machine).fetchingResources.fetchingPreview:invocation[0]';
      data: unknown;
    };
    'error.platform.(machine).readyToSwap.swapping:invocation[0]': {
      type: 'error.platform.(machine).readyToSwap.swapping:invocation[0]';
      data: unknown;
    };
    'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]': {
      type: 'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.(machine).fetchingResources.fetchingPoolInfo:invocation[0]': {
      type: 'done.invoke.(machine).fetchingResources.fetchingPoolInfo:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.(machine).fetchingResources.fetchingPreview:invocation[0]': {
      type: 'done.invoke.(machine).fetchingResources.fetchingPreview:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    '': { type: '' };
    'xstate.after(600)#(machine).debouncing': { type: 'xstate.after(600)#(machine).debouncing' };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    fetchBalances: 'done.invoke.(machine).fetchingBalances:invocation[0]';
    fetchTxCost: 'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]';
    fetchPoolRatio: 'done.invoke.(machine).fetchingResources.fetchingPoolInfo:invocation[0]';
    fetchPreview: 'done.invoke.(machine).fetchingResources.fetchingPreview:invocation[0]';
    swap: 'done.invoke.(machine).readyToSwap.swapping:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    fetchBalances: 'SELECT_COIN' | 'INVERT_COINS' | '';
    fetchTxCost:
      | 'SET_MAX_VALUE'
      | 'done.invoke.(machine).fetchingBalances:invocation[0]'
      | 'xstate.after(600)#(machine).debouncing';
    fetchPoolRatio: '';
    fetchPreview: 'done.invoke.(machine).fetchingResources.fetchingPoolInfo:invocation[0]';
    swap: 'SWAP';
  };
  eventsCausingGuards: {
    notHasOppositeCoin: 'SET_MAX_VALUE';
    inputIsNotEmpty: 'INPUT_CHANGE';
    notHasEthForNetworkFee: '';
    notHasAmount: '';
    notHasCoinFrom: '';
    notHasCoinTo: '';
    notHasPoolRatio: 'done.invoke.(machine).fetchingResources.fetchingPoolInfo:invocation[0]';
    noLiquidity: '';
    notHasCoinFromBalance: '';
  };
  eventsCausingDelays: {};
  matchesStates:
    | 'fetchingBalances'
    | 'fetchingResources'
    | 'fetchingResources.fetchingTxCost'
    | 'fetchingResources.validatingInputs'
    | 'fetchingResources.fetchingPoolInfo'
    | 'fetchingResources.fetchingPreview'
    | 'fetchingResources.settingAmounts'
    | 'fetchingResources.validatingSwap'
    | 'fetchingResources.success'
    | 'debouncing'
    | 'readyToSwap'
    | 'readyToSwap.idle'
    | 'readyToSwap.swapping'
    | 'readyToSwap.success'
    | 'invalid'
    | 'invalid.withoutAmount'
    | 'invalid.withoutCoinFrom'
    | 'invalid.withoutCoinTo'
    | 'invalid.withoutPoolRatio'
    | 'invalid.withoutLiquidity'
    | 'invalid.withoutCoinFromBalance'
    | 'invalid.withoutEthForNetworkFee'
    | {
        fetchingResources?:
          | 'fetchingTxCost'
          | 'validatingInputs'
          | 'fetchingPoolInfo'
          | 'fetchingPreview'
          | 'settingAmounts'
          | 'validatingSwap'
          | 'success';
        readyToSwap?: 'idle' | 'swapping' | 'success';
        invalid?:
          | 'withoutAmount'
          | 'withoutCoinFrom'
          | 'withoutCoinTo'
          | 'withoutPoolRatio'
          | 'withoutLiquidity'
          | 'withoutCoinFromBalance'
          | 'withoutEthForNetworkFee';
      };
  tags:
    | 'loading'
    | 'canSwap'
    | 'isSwapping'
    | 'needEnterAmount'
    | 'needSelectToken'
    | 'noPoolFound'
    | 'notHasLiquidity'
    | 'notHasCoinFromBalance'
    | 'notHasEthForNetworkFee';
}
