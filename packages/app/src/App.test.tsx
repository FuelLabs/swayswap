import "cross-fetch/polyfill";
import { renderWithRouter } from "@fuels-ui/test-utils";

import App from "./App";
import {
  createLiquidity,
  openAddLiquidity,
  openPoolList,
  validateButtonInformFromAmount,
  validateButtonInformToAmount,
  validateButtonInputsRight,
  validateButtonInsufficientFromBalance,
  validateButtonInsufficientToBalance,
  validateNewPoolInputsNoRatio,
  validateNewPoolMessage,
  validateNoOpenPosition,
} from "./systems/Pool/__tests__/tests.test";
import {
  checkFirstLoad,
  createWallet,
} from "./systems/Welcome/__tests__/tests.test";

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

    // TODO: need to create mint tests first
    // await validateButtonInputsRight();
    // await createLiquidity();
  });
});
