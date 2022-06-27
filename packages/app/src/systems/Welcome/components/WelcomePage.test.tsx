import { renderWithRouter, screen, waitFor } from "@swayswap/test-utils";

import { App } from "~/App";

describe("WelcomePage", () => {
  it("should always be redirect to welcome", async () => {
    renderWithRouter(<App />, { route: "/swap" });

    await waitFor(async () => {
      expect(
        await screen.findByText(/Welcome to SwaySwap/)
      ).toBeInTheDocument();
    });
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
