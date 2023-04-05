export type Maybe<T> = T | null | undefined;

export interface Coin {
  assetId: string;
  symbol?: string;
  name?: string;
  img?: string;
  pairOf?: Coin[];
}

export enum Pages {
  'home' = '/',
  'swap' = '/swap',
  'pool' = '/pool',
  'pool.list' = 'list',
  'pool.addLiquidity' = 'add-liquidity',
  'pool.removeLiquidity' = 'remove-liquidity',
  'welcome' = '/welcome',
  'welcomeInstall' = 'install',
  'welcomeConnect' = 'connect',
  'welcomeFaucet' = 'faucet',
  'welcomeTerms' = 'terms',
  'welcomeAddAssets' = 'add-assets',
  'welcomeMint' = 'mint',
}

export enum Queries {
  UserQueryBalances = 'UserQueryBalances',
  FaucetQuery = 'FaucetQuery',
}

export enum AppEvents {
  'refetchBalances' = 'refetchBalances',
  'updatedBalances' = 'updatedBalances',
}
