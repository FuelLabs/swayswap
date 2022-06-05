import "cross-fetch/polyfill";
import { renderWithRouter } from "@fuels-ui/test-utils";
import { Wallet } from "fuels";

import { mockEmptyLiquidityPool } from "../tests/mocks";
import {
  createLiquidity,
  validateButtonInformFromAmount,
  validateButtonInformToAmount,
  validateButtonInputsRight,
  validateButtonInsufficientFromBalance,
  validateButtonInsufficientToBalance,
  validateNewPoolInputsNoRatio,
  validateNewPoolMessage,
  validateNoOpenPosition,
} from "../tests/tests";

import App from "~/App";
import {
  CONTRACT_ID,
  DECIMAL_UNITS,
  FUEL_PROVIDER_URL,
  TOKEN_ID,
} from "~/config";
import { COIN_ETH, ONE_ASSET, parseUnits } from "~/systems/Core";
import { mockBalances } from "~/systems/Core/tests/mocks";
import { faucet, mint } from "~/systems/Core/tests/tests";
import { ExchangeContractAbi__factory } from "~/types/contracts";

const { privateKey } = Wallet.generate({ provider: FUEL_PROVIDER_URL });
const wallet = new Wallet(privateKey, FUEL_PROVIDER_URL);
jest.mock("../../Core/hooks/useWallet.ts", () => ({
  useWallet: jest.fn(() => wallet),
}));
jest.mock("../../Core/hooks/useContract.ts", () => ({
  useContract: () => ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet),
}));

describe("PoolPage", () => {
  beforeEach(() => {});

  describe("PoolPage -> List", () => {
    it("should render with no position first", async () => {
      await renderWithRouter(<App />, {
        route: "/pool/list",
      });
      await validateNoOpenPosition();
    });
  });

  describe("PoolPage -> Add Liquidity", () => {
    describe("PoolPage -> Add Liquidity -> no liquidity yet", () => {
      it("should see a 'new pool' message", async () => {
        const unmock = mockEmptyLiquidityPool();
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        validateNewPoolMessage();
        unmock();
      });

      it("button message should ask to inform Ether amount", async () => {
        const unmock = mockEmptyLiquidityPool();
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        validateButtonInformFromAmount();
        unmock();
      });

      it("button message should ask to inform DAI amount", async () => {
        const unmock = mockEmptyLiquidityPool();
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        validateButtonInformToAmount();
        unmock();
      });

      it("button message should show insufficient balance if has no coinFrom balance", async () => {
        const unmockEmpty = mockEmptyLiquidityPool();
        const unmockBalances = mockBalances();

        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        validateButtonInsufficientFromBalance();

        unmockEmpty();
        unmockBalances();
      });

      it("button message should show insufficient balance if has no coinTo balance", async () => {
        const unmockEmpty = mockEmptyLiquidityPool();
        const unmockBalances = mockBalances();

        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        validateButtonInsufficientToBalance();

        unmockEmpty();
        unmockBalances();
      });

      it("should not set other input value", async () => {
        const unmock = mockEmptyLiquidityPool();
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        validateNewPoolInputsNoRatio();
        unmock();
      });

      it("button message should enable if inputs are right", async () => {
        const unmockEmpty = mockEmptyLiquidityPool();
        const unmockBalances = mockBalances([
          {
            amount: ONE_ASSET,
            assetId: COIN_ETH,
          },
          {
            amount: parseUnits("4000", DECIMAL_UNITS).toBigInt(),
            assetId: TOKEN_ID,
          },
        ]);

        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        validateButtonInputsRight();

        unmockEmpty();
        unmockBalances();
      });

      it("should be able to create liquidity", async () => {
        await faucet(wallet, parseUnits("2000", DECIMAL_UNITS).toBigInt());
        await mint(wallet, parseUnits("4000000", DECIMAL_UNITS).toBigInt());

        renderWithRouter(<App />, { route: "/pool/add-liquidity" });

        createLiquidity();
      });
    });
  });
});
