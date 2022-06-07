import "cross-fetch/polyfill";
import { renderWithRouter } from "@fuels-ui/test-utils";
import { Wallet } from "fuels";

// import { mockEmptyLiquidityPool } from "../__tests__/mocks";
import { mockEmptyLiquidityPool } from "../__tests__/mocks";
import {
  testCreateLiquidity,
  testButtonInformFromAmount,
  testButtonInformToAmount,
  testButtonInputsRight,
  testButtonInsufficientFromBalance,
  testButtonInsufficientToBalance,
  testNewPoolInputsNoRatio,
  testNewPoolMessage,
  testNoOpenPosition,
} from "../__tests__/tests";

import App from "~/App";
import {
  CONTRACT_ID,
  DECIMAL_UNITS,
  FUEL_PROVIDER_URL,
  TOKEN_ID,
} from "~/config";
import { ONE_ASSET, parseUnits } from "~/systems/Core";
import { mockBalances } from "~/systems/Core/__tests__/mocks";
import { faucet, mint } from "~/systems/Core/__tests__/utils";
import { ExchangeContractAbi__factory } from "~/types/contracts";

const { privateKey } = Wallet.generate({ provider: FUEL_PROVIDER_URL });
const wallet = new Wallet(privateKey, FUEL_PROVIDER_URL);
jest.mock("../../Core/hooks/useWallet.ts", () => ({
  useWallet: jest.fn(() => wallet),
}));
jest.mock("../../Core/hooks/useContract.ts", () => ({
  useContract: () => ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet),
}));

jest.mock("../hooks/useUserPositions.ts", () => {
  const originalModule = jest.requireActual("../hooks/useUserPositions.ts");

  return {
    ...jest.requireActual("../hooks/useUserPositions.ts"),
    useUserPositions: jest.fn(originalModule.useUserPositions),
  };
});

jest.mock("../../Core/hooks/useBalances.ts", () => {
  const originalModule = jest.requireActual("../../Core/hooks/useBalances.ts");

  return {
    ...jest.requireActual("../../Core/hooks/useBalances.ts"),
    useBalances: jest.fn(originalModule.useBalances),
  };
});

describe("PoolPage", () => {
  describe("List", () => {
    it("should render with no position first", async () => {
      await renderWithRouter(<App />, {
        route: "/pool/list",
      });
      await testNoOpenPosition();
    });
  });

  describe("Add Liquidity", () => {
    it("should be able to create liquidity", async () => {
      await faucet(wallet);
      await mint(wallet, parseUnits("2000", DECIMAL_UNITS).toBigInt());

      renderWithRouter(<App />, { route: "/pool/add-liquidity" });

      await testCreateLiquidity();
    });

    describe("no liquidity yet", () => {
      beforeEach(() => {
        mockEmptyLiquidityPool();
      });

      it("should see a 'new pool' message", async () => {
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        await testNewPoolMessage();
      });

      it("button message should ask to inform Ether amount", async () => {
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        await testButtonInformFromAmount();
      });

      it("button message should ask to inform DAI amount", async () => {
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        await testButtonInformToAmount();
      });

      it("button message should show insufficient balance if has no coinFrom balance", async () => {
        mockBalances();

        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        await testButtonInsufficientFromBalance();
      });

      it("button message should show insufficient balance if has no coinTo balance", async () => {
        mockBalances();

        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        await testButtonInsufficientToBalance();
      });

      it("should not set other input value", async () => {
        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        await testNewPoolInputsNoRatio();
      });

      it("button message should enable if inputs are right", async () => {
        mockBalances([
          {
            amount: ONE_ASSET,
            assetId:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
          },
          {
            amount: parseUnits("4000", DECIMAL_UNITS).toBigInt(),
            assetId: TOKEN_ID,
          },
        ]);

        renderWithRouter(<App />, { route: "/pool/add-liquidity" });
        await testButtonInputsRight();
      });
    });
  });
});
