// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    invertDirection: 'INVERT_COINS';
    selectCoin: 'SELECT_COIN';
    setBalances: 'SET_BALANCES';
    setMaxValue: 'SET_MAX_VALUE';
    setInputValue: 'SET_INPUT_VALUE';
    clearContext: 'SET_INPUT_VALUE' | 'done.state.(machine).preparingToSwap';
    setTxCost: 'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]';
    setPoolInfo: 'done.invoke.(machine).fetchingResources.checkPoolCreated:invocation[0]';
    setPoolRatio: 'done.invoke.(machine).fetchingResources.checkPoolCreated:invocation[0]';
    setPreviewInfo: 'done.invoke.(machine).preparingToSwap.fetchingPreview:invocation[0]';
    setOppositeValue: 'done.invoke.(machine).preparingToSwap.fetchingPreview:invocation[0]';
    setValuesWithSlippage: 'done.invoke.(machine).preparingToSwap.fetchingPreview:invocation[0]';
  };
  internalEvents: {
    'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]': {
      type: 'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.(machine).fetchingResources.checkPoolCreated:invocation[0]': {
      type: 'done.invoke.(machine).fetchingResources.checkPoolCreated:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.(machine).preparingToSwap.fetchingPreview:invocation[0]': {
      type: 'done.invoke.(machine).preparingToSwap.fetchingPreview:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.(machine).preparingToSwap.swapping:invocation[0]': {
      type: 'done.invoke.(machine).preparingToSwap.swapping:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.after(1000)#(machine).debouncing': { type: 'xstate.after(1000)#(machine).debouncing' };
    'done.invoke.(machine).updateBalances:invocation[0]': {
      type: 'done.invoke.(machine).updateBalances:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    '': { type: '' };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    fetchTxCost: 'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]';
    fetchPoolRatio: 'done.invoke.(machine).fetchingResources.checkPoolCreated:invocation[0]';
    fetchPreview: 'done.invoke.(machine).preparingToSwap.fetchingPreview:invocation[0]';
    swap: 'done.invoke.(machine).preparingToSwap.swapping:invocation[0]';
    refetchBalances: 'done.invoke.(machine).updateBalances:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    fetchTxCost:
      | 'INVERT_COINS'
      | 'SELECT_COIN'
      | 'SET_MAX_VALUE'
      | 'xstate.after(1000)#(machine).debouncing'
      | 'done.invoke.(machine).updateBalances:invocation[0]';
    refetchBalances: 'SET_BALANCES' | 'done.state.(machine).preparingToSwap';
    fetchPoolRatio: 'done.invoke.(machine).fetchingResources.fetchingTxCost:invocation[0]';
    fetchPreview: '';
    swap: 'SWAP';
  };
  eventsCausingGuards: {
    inputIsNotEmpty: 'SET_INPUT_VALUE';
    notHasAmount: '';
    notHasCoinFrom: '';
    notHasCoinTo: '';
    noLiquidity: '';
    notHasCoinFromBalance: '';
    notHasEthForNetworkFee: '';
  };
  eventsCausingDelays: {};
  matchesStates:
    | 'debouncing'
    | 'fetchingResources'
    | 'fetchingResources.fetchingTxCost'
    | 'fetchingResources.checkPoolCreated'
    | 'fetchingResources.success'
    | 'checking'
    | 'waitingBalances'
    | 'withoutCoinFrom'
    | 'withoutCoinTo'
    | 'withoutAmount'
    | 'preparingToSwap'
    | 'preparingToSwap.fetchingPreview'
    | 'preparingToSwap.checking'
    | 'preparingToSwap.withoutLiquidity'
    | 'preparingToSwap.withoutCoinFromBalance'
    | 'preparingToSwap.withoutEthForNetworkFee'
    | 'preparingToSwap.canSwap'
    | 'preparingToSwap.swapping'
    | 'preparingToSwap.success'
    | 'updateBalances'
    | {
        fetchingResources?: 'fetchingTxCost' | 'checkPoolCreated' | 'success';
        preparingToSwap?:
          | 'fetchingPreview'
          | 'checking'
          | 'withoutLiquidity'
          | 'withoutCoinFromBalance'
          | 'withoutEthForNetworkFee'
          | 'canSwap'
          | 'swapping'
          | 'success';
      };
  tags:
    | 'loading'
    | 'needSelectToken'
    | 'needEnterAmount'
    | 'notHasLiquidity'
    | 'notHasCoinFromBalance'
    | 'notHasEthForNetworkFee'
    | 'canSwap'
    | 'swapSuccess';
}
