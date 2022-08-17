import { parseUnits } from "@ethersproject/units";
import {
  screen,
  renderWithRouter,
  waitFor,
  fireEvent,
} from "@swayswap/test-utils";
import type { Wallet } from "fuels";

import { mockUseUserPosition } from "../hooks/__mocks__/useUserPosition";

import { App } from "~/App";
import { DECIMAL_UNITS, TOKEN_ID } from "~/config";
import { COIN_ETH, ONE_ASSET } from "~/systems/Core";
import { mockUseBalances } from "~/systems/Core/hooks/__mocks__/useBalances";
import {
  createWallet,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";
import { faucet } from "~/systems/Faucet/hooks/__mocks__/useFaucet";
import { mint } from "~/systems/Mint/hooks/__mocks__/useMint";

let wallet: Wallet;

beforeAll(() => {
  wallet = createWallet();
  mockUseWallet(wallet);
});

describe("Add Liquidity", () => {
  beforeEach(() => {
    mockUseUserPosition();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should see a 'new pool' message", async () => {
    renderWithRouter(<App />, { route: "/pool/add-liquidity" });

    const newPoolMessage = await screen.findByText(/new pool/);
    expect(newPoolMessage).toBeInTheDocument();
  });

  it("should enter amount button be disabled by default", async () => {
    renderWithRouter(<App />, { route: "/pool/add-liquidity" });
    const submitBtn = await screen.findByText(/Enter Ether amount/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("should submit button ask to inform DAI", async () => {
    renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });
    const coinFromInput = screen.getByLabelText(/Coin from input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: "10",
      },
    });

    await waitFor(() => {
      const submitBtn = screen.getByText(/Enter DAI amount/);
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });
  });

  it("should show insufficient warning if has no coinFrom balance", async () => {
    mockUseBalances();
    renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    const coinFromInput = screen.getByLabelText(/Coin from input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: "10",
      },
    });
    const coinToInput = screen.getByLabelText(/Coin to input/);
    fireEvent.change(coinToInput, {
      target: {
        value: "1000",
      },
    });

    const submitBtn = await screen.findByText(/Insufficient Ether/i);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("should show insufficient warning if has no coinTo balance", async () => {
    mockUseBalances();
    renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    const coinFromInput = screen.getByLabelText(/Coin from input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: "0.1",
      },
    });
    const coinToInput = screen.getByLabelText(/Coin to input/);
    fireEvent.change(coinToInput, {
      target: {
        value: "1000",
      },
    });

    const submitBtn = await screen.findByText(/Insufficient DAI balance/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("should be able to set coin to input values if no liquidity added", async () => {
    renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    const coinFromInput = await screen.findByLabelText(/Coin from input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: "10",
      },
    });
    expect(coinFromInput).toHaveValue("10");

    const coinToInput = await screen.findByLabelText(/Coin to input/);
    fireEvent.change(coinToInput, {
      target: {
        value: "1000",
      },
    });
    expect(coinToInput).toHaveValue("1000");
  });

  const MINT_VALUE = parseUnits("4000", DECIMAL_UNITS).toBigInt();

  it("should be able to click on submit button if inputs are right", async () => {
    mockUseBalances([
      { amount: ONE_ASSET, assetId: COIN_ETH },
      { amount: MINT_VALUE, assetId: TOKEN_ID },
    ]);

    renderWithRouter(<App />, { route: "/pool/add-liquidity" });

    const coinFromInput = screen.getByLabelText(/Coin from input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: "0.5",
      },
    });

    const coinToInput = screen.getByLabelText(/Coin to input/);
    fireEvent.change(coinToInput, {
      target: {
        value: "2000",
      },
    });

    const submitBtn = await screen.findByText(/Create liquidity/);
    expect(submitBtn).toBeInTheDocument();
  });

  it("Should be able to create liquidity", async () => {
    jest.unmock("../hooks/useUserPositions.ts");

    await faucet(wallet);
    await mint(wallet);
    const { user } = renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    const coinFromInput = await screen.findByLabelText(/Coin from input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: "0.1",
      },
    });

    const coinToInput = await screen.findByLabelText(/Coin to input/);
    fireEvent.change(coinToInput, {
      target: {
        value: "500",
      },
    });

    const submitBtn = await screen.findByText(/Create liquidity/);
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);
  });

  it.skip("should show '0.' if typed only '.' in the input", async () => {
    jest.unmock("../hooks/useUserPositions.ts");

    renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    const coinFromInput = screen.getByLabelText(/Coin from input/);
    fireEvent.change(coinFromInput, {
      target: {
        value: ".",
      },
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/Coin from input/)).toHaveValue("0.");
    });
  });
});
