import "cross-fetch/polyfill";
import { renderWithRouter, screen } from "@swayswap/test-utils";

import App from "~/App";

describe("WalletPage", () => {
  it("should always be redirect to welcome", async () => {
    renderWithRouter(<App />, { route: "/pool/list" });
    expect(await screen.findByText(/Welcome to SwaySwap/)).toBeInTheDocument();
  });

  it("should be able to do all welcome steps and see swap page after", async () => {
    const { user } = renderWithRouter(<App />, {
      route: "/welcome/create-wallet",
    });

    /**
     * First step: Creating wallet
     */
    const createWalletBtn = screen.getByRole("button", {
      name: /Create Wallet/i,
    });
    expect(createWalletBtn).toBeInTheDocument();
    await user.click(createWalletBtn);

    /**
     * Second step: Adding funds
     */
    const addFundsBtn = await screen.findByRole("button", {
      name: /Give me ETH/i,
    });
    expect(addFundsBtn).toBeInTheDocument();
    await user.click(addFundsBtn);

    /**
     * Third step: done
     */
    const goToSwapBtn = await screen.findByRole("button", {
      name: /Go to Swap/i,
    });
    expect(goToSwapBtn).toBeInTheDocument();
    await user.click(goToSwapBtn);

    /**
     * Finished: go to swap
     */
    const swapBtn = await screen.findByRole("button", {
      name: /Enter amount/i,
    });
    expect(swapBtn).toBeInTheDocument();
  });
});
