import { formatUnits } from 'ethers/lib/utils';
import { toNumber } from 'fuels';
import { useQuery } from 'react-query';

import { useBalances } from './useBalances';

import { DECIMAL_UNITS } from '~/config';
import { useContract } from '~/context/AppContext';
import { COIN_ETHDAI } from '~/lib/constants';

export function usePoolInfo() {
  const contract = useContract();
  const result = useQuery('PoolPage-poolInfo', () => contract?.callStatic.get_info());
  const { data: balances } = useBalances();
  const lpTokenBalance =
    balances?.find((coin) => coin.assetId === COIN_ETHDAI.assetId)?.amount || BigInt(0);

  const info = result.data;
  const pooledDAI = info && formatUnits(info.token_reserve, DECIMAL_UNITS);
  const pooledETH = info && formatUnits(info.eth_reserve, DECIMAL_UNITS);
  const poolTokens = lpTokenBalance ? formatUnits(lpTokenBalance, DECIMAL_UNITS) : '0';

  const lpTokenBalanceNum = toNumber(lpTokenBalance);
  const totalLiquidity = toNumber(info?.lp_token_supply || BigInt(0));
  const tokenReserveETH = toNumber(info?.eth_reserve || BigInt(0));
  const tokenReserveDAI = toNumber(info?.token_reserve || BigInt(0));
  const ethAmount = (lpTokenBalanceNum * tokenReserveETH) / totalLiquidity;
  const tokenAmount = (lpTokenBalanceNum * tokenReserveDAI) / totalLiquidity;
  const poolShare = (ethAmount / tokenAmount) * 100;

  return {
    ...result,
    pooledETH,
    pooledDAI,
    poolTokens,
    poolShare,
  };
}
