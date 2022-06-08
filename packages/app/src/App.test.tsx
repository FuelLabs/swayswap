import "cross-fetch/polyfill";
import { renderWithRouter } from "@swayswap/test-utils";

import App from "./App";
import {
  openAddLiquidity,
  openPoolList,
  testButtonInformFromAmount,
  testButtonInformToAmount,
  testButtonInsufficientFromBalance,
  testButtonInsufficientToBalance,
  testNewPoolInputsNoRatio,
  testNewPoolMessage,
  testNoOpenPosition,
} from "./systems/Pool/__tests__/tests";
import {
  testCheckFirstLoad,
  testCreateWallet,
} from "./systems/Welcome/__tests__/tests";

describe("AppPage", () => {
  it("should validate whole app flow", async () => {
    expect(true);
    // await renderWithRouter(<App />, { route: "/pool/list" });
    await testCheckFirstLoad();
    await testCreateWallet();
    await openPoolList();
    await testNoOpenPosition();
    await openAddLiquidity();
    await testNewPoolMessage();
    await testButtonInformFromAmount();
    await testButtonInformToAmount();
    await testButtonInsufficientFromBalance();
    await testButtonInsufficientToBalance();
    await testNewPoolInputsNoRatio();

    // TODO: need to create mint tests first
    // await validateButtonInputsRight();
    // await createLiquidity();
  });
});
