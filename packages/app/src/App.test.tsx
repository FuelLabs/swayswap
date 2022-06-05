import "cross-fetch/polyfill";
import { renderWithRouter } from "@fuels-ui/test-utils";

import App from "./App";
import {
  openAddLiquidity,
  openPoolList,
  validateButtonInformFromAmount,
  validateButtonInformToAmount,
  validateButtonInsufficientFromBalance,
  validateButtonInsufficientToBalance,
  validateNewPoolInputsNoRatio,
  validateNewPoolMessage,
  validateNoOpenPosition,
} from "./systems/Pool/tests/tests";
import { checkFirstLoad, createWallet } from "./systems/Welcome/tests/tests";

describe("AppPage", () => {
  it("should validate whole app flow", async () => {
    await renderWithRouter(<App />, { route: "/pool/list" });
    await checkFirstLoad();
    await createWallet();
    await openPoolList();
    await validateNoOpenPosition();
    await openAddLiquidity();
    await validateNewPoolMessage();
    await validateButtonInformFromAmount();
    await validateButtonInformToAmount();
    await validateButtonInsufficientFromBalance();
    await validateButtonInsufficientToBalance();
    await validateNewPoolInputsNoRatio();
  });
});
