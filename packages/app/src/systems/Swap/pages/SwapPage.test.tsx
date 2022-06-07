import "cross-fetch/polyfill";

import { renderWithRouter, screen, waitFor } from "@swayswap/test-utils";
import type { Wallet } from "fuels";

import App from "~/App";
import {
  createWallet,
  mockUseWallet,
  mockUseContract,
} from "~/systems/Core/hooks/__mocks__";
import { mockUseBalances } from "~/systems/Core/hooks/__mocks__/useBalances";

describe("SwapPage", () => {
  let wallet: Wallet;

  beforeAll(() => {
    wallet = createWallet();
    mockUseWallet(wallet);
    mockUseContract(wallet);
  });

  it("should swap button be disabled", async () => {
    renderWithRouter(<App />, { route: "/swap" });

    await waitFor(async () => {
      const btn = screen.getByText(/enter amount/i);
      expect(btn).toBeDisabled();
    });
  });

  it("should show balance correclty", async () => {
    mockUseBalances();
    renderWithRouter(<App />, { route: "/swap" });

    await waitFor(async () => {
      const btn = screen.getByText("Balance: 1.0");
      expect(btn).toBeInTheDocument();
    });
  });
});
