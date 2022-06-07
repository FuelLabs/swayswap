import "cross-fetch/polyfill";
import { renderWithRouter } from "@fuels-ui/test-utils";

import { testCheckFirstLoad, testCreateWallet } from "../__tests__/tests";

import App from "~/App";

describe("WalletPage", () => {
  it("when first loaded, any route will redirect user to Create Wallet page", async () => {
    await renderWithRouter(<App />, { route: "/pool/list" });
    await testCheckFirstLoad();
  });

  it("should do create wallet flow", async () => {
    await renderWithRouter(<App />, {
      route: "/welcome/create-wallet",
    });
    await testCreateWallet();
  });
});
