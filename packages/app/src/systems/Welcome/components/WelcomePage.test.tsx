import { renderWithRouter, screen, waitFor } from "@swayswap/test-utils";

import { App } from "~/App";

describe("WelcomePage", () => {
  it("should always be redirect to welcome", async () => {
    renderWithRouter(<App />, { route: "/swap" });

    await waitFor(
      async () => {
        expect(await screen.findByText(/legal disclaimer/)).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  });

  it("should be able to do all welcome steps and see swap page after", async () => {
    const { user } = renderWithRouter(<App />, {
      route: "/welcome",
    });

    /**
     * First step: done
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
