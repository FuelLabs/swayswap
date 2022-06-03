export interface Coin {
  assetId: string;
  symbol?: string;
  name?: string;
  img?: string;
  pairOf?: Coin[];
}

export enum Pages {
  'mint' = '/mint',
  'swap' = '/swap',
  'pool' = '/pool',
  'pool.list' = 'list',
  'pool.addLiquidity' = 'add-liquidity',
  'pool.removeLiquidity' = 'remove-liquidity',
  'welcome' = '/welcome',
  'welcome.createWallet' = 'create-wallet',
  'welcome.addFunds' = 'add-funds',
  'welcome.done' = 'done',
}

export enum Queries {
  UserQueryBalances = 'UserQueryBalances',
  FaucetQuery = 'FaucetQuery',
}
