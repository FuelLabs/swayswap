import {
  screen,
  renderWithRouter,
  waitFor,
  fireEvent,
} from "@swayswap/test-utils";
import type { Wallet } from "fuels";

import { mockUseUserPosition } from "../hooks/__mocks__/useUserPosition";

import { App } from "~/App";
import { CONTRACT_ID } from "~/config";
import { COIN_ETH, ONE_ASSET, TOKENS } from "~/systems/Core";
import { mockUseBalances } from "~/systems/Core/hooks/__mocks__/useBalances";
import {
  createWallet,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";

let wallet: Wallet;

beforeAll(() => {
  wallet = createWallet();
  mockUseWallet(wallet);
});

const USER_LIQUIDITY_POSITIONS = {
  ethReserve: BigInt(1009199438931),
  formattedEthReserve: "1,009.199",
  formattedPoolShare: "0.019",
  formattedPoolTokens: "0.198",
  formattedPooledDAI: "395.6",
  formattedPooledETH: "0.199",
  formattedTokenReserve: "2,001,817.154",
  hasPositions: true,
  poolRatio: 0.0005041416678966015,
  poolShare: 0.00019762092871333754,
  poolTokens: BigInt(198666508),
  poolTokensNum: BigInt(198666508),
  pooledDAI: 395600965122.81934,
  pooledETH: 199438930.3785234,
  tokenReserve: BigInt(2001817154177355),
  totalLiquidity: BigInt(1005290832775),
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

    const newPoolMessage = await screen.findByText(/Your current positions/);
    expect(newPoolMessage).toBeInTheDocument();
  });

  it("should enter amount button be disabled by default", async () => {
    renderWithRouter(<App />, { route: "/pool/remove-liquidity" });
    const submitBtn = await screen.findByText("Enter ETH/DAI amount");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("should show insufficient warning if has no LP Token balance", async () => {
    mockUseBalances();
    renderWithRouter(<App />, {
      route: "/pool/remove-liquidity",
    });

    const coinFromInput = screen.getByLabelText(/LP Token Input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: "1",
      },
    });

    const submitBtn = await screen.findByText(/Insufficient ETH\/DAI balance/i);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("should be able to click on submit button if inputs are right", async () => {
    const liquidityToken = TOKENS.find((c) => c.assetId === CONTRACT_ID);

    mockUseBalances([
      { amount: ONE_ASSET, assetId: COIN_ETH },
      { amount: ONE_ASSET, assetId: liquidityToken?.assetId || "" },
    ]);

    renderWithRouter(<App />, { route: "/pool/remove-liquidity" });

    const coinFromInput = screen.getByLabelText(/Set Maximun Balance/);
    fireEvent.click(coinFromInput);

    const submitBtn = await screen.findByText(/Remove liquidity/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it("should show '0.' if typed only '.' in the input", async () => {
    jest.unmock("../hooks/useUserPositions.ts");

    renderWithRouter(<App />, {
      route: "/pool/remove-liquidity",
    });

    const coinFromInput = screen.getByLabelText(/LP Token Input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: ".",
      },
    });

    await waitFor(() => {
      expect(coinFromInput).toHaveValue("0.");
    });
  });
});
