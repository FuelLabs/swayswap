import { AddLiquidityProvider } from "../hooks/useAddLiquidity";
import { AddLiquidity } from "../pages";

export const AddLiquidityPortal = () => (
  <AddLiquidityProvider>
    <AddLiquidity />
  </AddLiquidityProvider>
);
