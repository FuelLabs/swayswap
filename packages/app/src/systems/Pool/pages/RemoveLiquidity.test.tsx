import type { Fuel, FuelWalletLocked } from "@fuel-wallet/sdk";
import {
  screen,
  renderWithRouter,
  fireEvent,
  act,
  waitFor,
} from "@swayswap/test-utils";
import Decimal from "decimal.js";
import { bn } from "fuels";

import { mockUseUserPosition } from "../hooks/__mocks__/useUserPosition";
import type { PoolInfoPreview } from "../utils";

import { App } from "~/App";
import { CONTRACT_ID } from "~/config";
import { COIN_ETH, ONE_ASSET, TOKENS } from "~/systems/Core";
import { mockUseBalances } from "~/systems/Core/hooks/__mocks__/useBalances";
import {
  createWallet,
  mockUseFuel,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";
import { setAgreement } from "~/systems/Welcome";

let wallet: FuelWalletLocked;
let fuel: Fuel;

beforeAll(async () => {
  setAgreement(true);
  ({ wallet, fuel } = await createWallet());
  mockUseFuel(fuel);
  mockUseWallet(wallet);
});

const USER_LIQUIDITY_POSITIONS: PoolInfoPreview = {
  ethReserve: bn("1009199438931"),
  formattedEthReserve: "1,009.199",
  formattedPoolShare: "0.019",
  formattedPoolTokens: "0.198",
  formattedPooledDAI: "395.6",
  formattedPooledETH: "0.199",
  formattedTokenReserve: "2,001,817.154",
  hasPositions: true,
  poolRatio: new Decimal("0.0005041416678966015"),
  poolShare: new Decimal("0.00019762092871333754"),
  poolTokens: bn("198666508"),
  pooledDAI: bn.parseUnits("395600965122.81934"),
  pooledETH: bn.parseUnits("199438930.3785234"),
  tokenReserve: bn("2001817154177355"),
  totalLiquidity: bn("1005290832775"),
};

describe("Remove Liquidity", () => {
  beforeEach(() => {
    mockUseUserPosition(USER_LIQUIDITY_POSITIONS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should see a 'current positions' box", async () => {
    renderWithRouter(<App />, { route: "/pool/remove-liquidity" });
    await waitFor(async () => {
      const currentPositionsMessage = await screen.findByText(
        /Your current positions/,
        undefined,
        { timeout: 10000 }
      );
      expect(currentPositionsMessage).toBeInTheDocument();
    });
  });

  it("should enter amount button be disabled by default", async () => {
    renderWithRouter(<App />, { route: "/pool/remove-liquidity" });
    await act(async () => {
      const submitBtn = await screen.findByText("Enter sETH/DAI amount");

      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });
  });

  it("should show insufficient warning if has no LP Token balance", async () => {
    mockUseBalances();
    renderWithRouter(<App />, {
      route: "/pool/remove-liquidity",
    });

    await waitFor(
      async () => {
        const coinFromInput = screen.getByLabelText(/LP Token Input/);
        fireEvent.change(coinFromInput, {
          target: {
            value: "1",
          },
        });

        const submitBtn = await screen.findByText(
          /Insufficient sETH\/DAI balance/i
        );
        expect(submitBtn).toBeInTheDocument();
        expect(submitBtn).toBeDisabled();
      },
      { timeout: 10000 }
    );
  });

  it("should be able to click on submit button if inputs are right", async () => {
    const liquidityToken = TOKENS.find((c) => c.assetId === CONTRACT_ID);

    mockUseBalances([
      { amount: ONE_ASSET, assetId: COIN_ETH },
      { amount: ONE_ASSET, assetId: liquidityToken?.assetId || "" },
    ]);

    renderWithRouter(<App />, { route: "/pool/remove-liquidity" });

    await waitFor(async () => {
      const coinFromInput = screen.getByLabelText(/Set Maximum Balance/);
      fireEvent.click(coinFromInput);

      const submitBtn = await screen.findByText(/Remove liquidity/);
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();
    });
  });
});
