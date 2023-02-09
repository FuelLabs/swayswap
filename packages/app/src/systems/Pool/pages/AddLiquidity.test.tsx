import type { FuelWalletLocked } from "@fuel-wallet/sdk";
import {
  screen,
  renderWithRouter,
  waitFor,
  fireEvent,
} from "@swayswap/test-utils";

import { mockUseUserPosition } from "../hooks/__mocks__/useUserPosition";
import * as poolQueries from "../utils/queries";

import { App } from "~/App";
import { ZERO } from "~/systems/Core";
import {
  createWallet,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";
import { faucet } from "~/systems/Faucet/hooks/__mocks__/useFaucet";
import { mint } from "~/systems/Mint/hooks/__mocks__/useMint";

let wallet: FuelWalletLocked;

beforeAll(async () => {
  wallet = await createWallet();
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
    jest.spyOn(poolQueries, "fetchPoolInfo").mockImplementation(async () => ({
      eth_reserve: ZERO,
      token_reserve: ZERO,
      lp_token_supply: ZERO,
    }));
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

    await waitFor(
      () => {
        const submitBtn = screen.getByText(/Enter DAI amount/);
        expect(submitBtn).toBeInTheDocument();
        expect(submitBtn).toBeDisabled();
      },
      { timeout: 10000 }
    );
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

  describe("Create/Add liquidity", () => {
    it("Should be able to create liquidity", async () => {
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

      const submitBtn = await screen.findByText(/Create liquidity/, undefined, {
        timeout: 10000,
      });
      expect(submitBtn).toBeInTheDocument();
      await user.click(submitBtn);
    });

    it("Should be able to add liquidity", async () => {
      renderWithRouter(<App />, {
        route: "/pool/add-liquidity",
      });

      const coinFromInput = await screen.findByLabelText(/Coin from input/);
      fireEvent.change(coinFromInput, {
        target: {
          value: "0.1",
        },
      });

      waitFor(async () => {
        const submitBtn = await screen.findByText(/Add liquidity/);
        expect(submitBtn).toBeInTheDocument();
      });
    });
  });

  it("should show '0.' if typed only '.' in the input", async () => {
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
