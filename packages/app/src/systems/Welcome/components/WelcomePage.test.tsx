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
      name: /Connect Wallet/i,
    });
    expect(connectButton).toBeInTheDocument();
    await waitFor(async () => {
      await user.click(connectButton);
    });

    /**
     * Second step: done
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
