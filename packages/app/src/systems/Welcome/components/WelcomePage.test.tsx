import type { FuelWalletLocked } from "@fuel-wallet/sdk";
import { renderWithRouter, screen, waitFor } from "@swayswap/test-utils";

import { App } from "~/App";
import {
  createWallet,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";

let wallet: FuelWalletLocked;

beforeAll(async () => {
  wallet = await createWallet();
  mockUseWallet(wallet);
});

describe("WelcomePage", () => {
  it("should always be redirect to welcome", async () => {
    renderWithRouter(<App />, { route: "/swap" });

    await waitFor(
      async () => {
        expect(
          await screen.findByText(/Welcome to SwaySwap/)
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
      name: /Connect Wallet/i,
    });
    expect(connectButton).toBeInTheDocument();
    await user.click(connectButton);

    /**
     * Second step: done
     */
    const acceptAgreement = await screen.findByLabelText(
      /Accept the use agreement/i
    );
    expect(acceptAgreement).not.toBeChecked();
    await user.click(acceptAgreement);
    expect(acceptAgreement).toBeChecked();

    const goToSwapBtn = await screen.findByRole("button", {
      name: /Get Swapping!/i,
    });
    expect(goToSwapBtn).toBeInTheDocument();
    await user.click(goToSwapBtn);

    /**
     * Finished: go to swap
     */
    const swapBtn = await screen.findByLabelText(/swap button/i);
    expect(swapBtn).toBeInTheDocument();
  });
});
