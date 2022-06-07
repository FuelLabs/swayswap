import "cross-fetch/polyfill";
import { renderWithRouter } from "@fuels-ui/test-utils";

import { checkFirstLoad, createWallet } from "../__tests__/tests";

import App from "~/App";

describe("WalletPage", () => {
  it("when first loaded, any route will redirect user to Create Wallet page", async () => {
    await renderWithRouter(<App />, { route: "/pool/list" });
    await checkFirstLoad();
  });

  it("should do create wallet flow", async () => {
    await renderWithRouter(<App />, {
      route: "/welcome/create-wallet",
    });
    await createWallet();
  });
});
