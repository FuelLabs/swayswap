import "cross-fetch/polyfill";
import {
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from "@fuels-ui/test-utils";

import App from "~/App";

export const checkFirstLoad = async () => {
  await renderWithRouter(<App />, { route: "/pool/list" });

  const createWalletBtn = await screen.findByTestId("createWalletBtn");
  expect(createWalletBtn).toBeInTheDocument();
};

export const createWallet = async () => {
  // const { user } = await renderWithRouter(<App />, {
  await renderWithRouter(<App />, {
    route: "/welcome/create-wallet",
  });

  const createWalletBtn = await screen.findByTestId("createWalletBtn");
  expect(createWalletBtn).toBeInTheDocument();
  fireEvent.click(createWalletBtn);
  // await user.click(createWalletBtn);

  await waitFor(async () => {
    const addFundsBtn = await screen.findByTestId("addFundsBtn");
    expect(addFundsBtn).toBeInTheDocument();
    // this is throwing "Missing queryFn error", creaking tests
    fireEvent.click(addFundsBtn);
  });

  await waitFor(async () => {
    const goToSwapBtn = await screen.findByTestId("goToSwapBtn");
    expect(goToSwapBtn).toBeInTheDocument();
    fireEvent.click(goToSwapBtn);
  });

  await waitFor(async () => {
    const swapBtn = await screen.findByText(/Enter amount/i);
    expect(swapBtn).toBeInTheDocument();
  });
};

describe("WalletPage", () => {
  it("when first loaded, any route will redirect user to Create Wallet page", async () => {
    await checkFirstLoad();
  });

  it("should do create wallet flow", async () => {
    await createWallet();
  });
});
