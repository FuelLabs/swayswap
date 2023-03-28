import { renderWithRouter, screen, waitFor } from "@swayswap/test-utils";

import { App } from "~/App";
import {
  createWallet,
  mockUseFuel,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";

beforeAll(async () => {
  const { wallet, fuel } = await createWallet(false);
  mockUseWallet(wallet);
  mockUseFuel(fuel);
});

describe("WelcomePage", () => {
  it("should always be redirect to welcome", async () => {
    renderWithRouter(<App />, { route: "/swap" });

    await waitFor(
      async () => {
        expect(
          await screen.findByText(/Welcome to SwaySwap/i)
        ).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  });

  it("should be able to do all welcome steps and see swap page after", async () => {
    const { user } = renderWithRouter(<App />, {
      route: "/welcome",
    });

    /**
     * First step: connect wallet
     */
    const connectButton = await screen.findByRole("button", {
      name: "Connect Wallet",
    });
    expect(connectButton).toBeInTheDocument();
    await user.click(connectButton);
    /**
     * Second step: faucet
     */
    const faucetButton = await screen.findByRole("button", {
      name: /Give me ETH/i,
    });
    expect(faucetButton).toBeInTheDocument();
    await waitFor(async () => {
      await user.click(faucetButton);
    });

    /**
     * Third step: add assets
     */
    const addAssetsButton = await screen.findByRole("button", {
      name: /Add Assets/i,
    });
    await waitFor(async () => {
      await user.click(addAssetsButton);
    });

    /**
     * Fourth step: add assets
     */
    const mintAssetsButton = await screen.findByRole("button", {
      name: /Mint Assets/i,
    });
    await waitFor(async () => {
      await user.click(mintAssetsButton);
    });

    /**
     * Fifth step: done
     */
    const acceptAgreement = await screen.findByLabelText(
      /Accept the use agreement/i
    );
    expect(acceptAgreement).not.toBeChecked();
    await waitFor(async () => {
      await user.click(acceptAgreement);
    });
    expect(acceptAgreement).toBeChecked();

    const goToSwapBtn = await screen.findByRole("button", {
      name: /Get Swapping!/i,
    });
    expect(goToSwapBtn).toBeInTheDocument();
    await waitFor(async () => {
      await user.click(goToSwapBtn);
    });

    /**
     * Finished: go to swap
     */
    const swapBtn = await screen.findByLabelText(/swap button/i);
    expect(swapBtn).toBeInTheDocument();
  });
});
