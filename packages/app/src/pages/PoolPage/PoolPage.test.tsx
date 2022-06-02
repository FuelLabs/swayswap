import { renderWithRouter, screen, waitFor } from "@fuels-ui/test-utils";
import { Wallet } from "fuels";

import App from "~/App";
import { CONTRACT_ID, FUEL_PROVIDER_URL } from "~/config";
// import { mint } from "~/lib/test-utils";
import { ExchangeContractAbi__factory } from "~/types/contracts";

const { privateKey } = Wallet.generate({ provider: FUEL_PROVIDER_URL });
const wallet = new Wallet(privateKey, FUEL_PROVIDER_URL);

jest.mock("../../hooks/useWallet", () => ({
  useWallet: jest.fn(() => wallet),
}));

jest.mock("../../hooks/useContract.ts", () => ({
  useContract: () => ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet),
}));

describe("PoolPage", () => {
  it("should render with no position first", async () => {
    renderWithRouter(<App />, { route: "/pool/list" });

    const noPositions = await screen.findByText(/no open positions/i);
    expect(noPositions).toBeInTheDocument();
  });

  // it("should see a no pool message when try to add first time", async () => {
  //   jest.mock("../../lib/utils.ts", () => ({ divideFnValidOnly: () => 0 }));
  //   renderWithRouter(<App />, { route: "/pool/add-liquidity" });

  //   await waitFor(async () => {
  //     const noResults = await screen.findByText(/You are creating a new pool/);
  //     expect(noResults).toBeInTheDocument();
  //   });
  //   jest.unmock("../../lib/utils.ts");
  // });

  it("should show insufficient balance if has no coinFrom balance", async () => {
    const { user } = renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    await waitFor(async () => {
      const submitBtn = await screen.findByText(/Enter Ether amount/);
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });

    const coinFromInput = screen.getByLabelText(/Coin From Input/);
    const coinToInput = screen.getByLabelText(/Coin To Input/);
    expect(coinFromInput).toBeInTheDocument();
    expect(coinToInput).toBeInTheDocument();

    const newCoinFromValue = "10";
    await user.type(coinFromInput, newCoinFromValue);

    await waitFor(async () => {
      expect(coinFromInput).toHaveValue(newCoinFromValue);
      // expect(coinToInput).toHaveValue("1000");
      const submitBtn = await screen.findByText(/Enter DAI amount/);
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });

    // throwing other user.type events are causing error with environment: "Warning: The current testing environment is not configured to support act(...) at button"
    // I think it's because when we type, there're side-effects to set the value of other input
    const newCoinToValue = "1000";
    await user.type(coinToInput, newCoinToValue);

    await waitFor(async () => {
      expect(coinToInput).toHaveValue(newCoinToValue);
      // expect(coinToInput).toHaveValue("1000");
      const submitBtn = await screen.findByText(/Insufficient Ether balance/);
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });

    // Need this to reset global state
    // skip it for same "act error"
    // await waitFor(async () => {
    //   await user.clear(coinFromInput);
    // await user.clear(coinToInput);
    // });
  });

  // it("should be able to add liquidity after mint", async () => {
  //   await mint(wallet, "1000000", "2000000");
  //   const { user } = renderWithRouter(<App />, {
  //     route: "/pool/add-liquidity",
  //   });

  //   await waitFor(async () => {
  //     const etherBalance = await screen.findByLabelText(/ether balance/i);
  //     expect(etherBalance).toHaveTextContent(/1000000/);
  //   });

  //   const coinFromInput = screen.getByLabelText(/Coin From/);
  //   const coinToInput = screen.getByLabelText(/Coin To/);
  //   await user.type(coinFromInput, "10");
  //   await user.type(coinToInput, "4000");

  //   await waitFor(async () => {
  //     const submit = await screen.findByTestId("submit");
  //     expect(submit).not.toBeDisabled();
  //     await user.click(submit);
  //   });

  //   await waitFor(async () => {
  //     expect(
  //       await screen.findByLabelText("Step completed: Provide liquidity")
  //     ).toBeInTheDocument();
  //   });

  //   await waitFor(async () => {
  //     expect(await screen.findByLabelText(/Coin From/)).toBeInTheDocument();
  //   });
  // });

  // it("should have positions on pool preview", async () => {
  //   renderWithRouter(<App />, { route: "/pool/list" });
  //   const noPositions = await screen.findByText(/pooled eth/i);
  //   expect(noPositions).toBeInTheDocument();
  // });
});
