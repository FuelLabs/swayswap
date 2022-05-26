import { renderWithRouter, screen, waitFor } from "@fuels-ui/test-utils";
import { Wallet } from "fuels";

import App from "~/App";
import { CONTRACT_ID, FUEL_PROVIDER_URL } from "~/config";
import { mint } from "~/lib/test-utils";
import { Exchange_contractAbi__factory } from "~/types/contracts";

const { privateKey } = Wallet.generate({ provider: FUEL_PROVIDER_URL });
const wallet = new Wallet(privateKey, FUEL_PROVIDER_URL);

jest.mock("../../hooks/useWallet", () => ({
  useWallet: jest.fn(() => wallet),
}));

jest.mock("../../hooks/useContract.ts", () => ({
  useContract: () => Exchange_contractAbi__factory.connect(CONTRACT_ID, wallet),
}));

describe("PoolPage", () => {
  it("should render with no position first", async () => {
    renderWithRouter(<App />, { route: "/pool/list" });

    const noPositions = await screen.findByText(/no open positions/i);
    expect(noPositions).toBeInTheDocument();
  });

  it("should see a no pool message when try to add first time", async () => {
    jest.mock("../../lib/asset.ts", () => ({ calculateRatio: () => 0 }));
    renderWithRouter(<App />, { route: "/pool/add-liquidity" });

    await waitFor(async () => {
      const noResults = await screen.findByText(/You are creating a new pool/);
      expect(noResults).toBeInTheDocument();
    });
    jest.unmock("../../lib/asset.ts");
  });

  it("should show insufficient balance if has no coinTo balance", async () => {
    const { user } = renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    await waitFor(async () => {
      expect(await screen.findByText(/Enter Ether amount/)).toBeInTheDocument();
    });

    const coinFromInput = screen.getByLabelText(/Coin From/);
    const coinToInput = screen.getByLabelText(/Coin To/);
    expect(coinFromInput).toBeInTheDocument();
    expect(coinToInput).toBeInTheDocument();

    await user.type(coinFromInput, "10");
    await user.type(coinToInput, "1000");

    const submitBtn = await screen.findByText(/Insufficient Ether balance/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    // Need this to reset global state
    await user.clear(coinFromInput);
    await user.clear(coinToInput);
  });

  it("should be able to add liquidity after mint", async () => {
    await mint(wallet, "1000000", "2000000");
    const { user } = renderWithRouter(<App />, {
      route: "/pool/add-liquidity",
    });

    await waitFor(async () => {
      const etherBalance = await screen.findByLabelText(/ether balance/i);
      expect(etherBalance).toHaveTextContent(/1000000/);
    });

    const coinFromInput = screen.getByLabelText(/Coin From/);
    const coinToInput = screen.getByLabelText(/Coin To/);
    await user.type(coinFromInput, "10");
    await user.type(coinToInput, "4000");

    await waitFor(async () => {
      const submit = await screen.findByTestId("submit");
      expect(submit).not.toBeDisabled();
      await user.click(submit);
    });

    await waitFor(async () => {
      expect(
        await screen.findByLabelText("Step completed: Provide liquidity")
      ).toBeInTheDocument();
    });

    await waitFor(async () => {
      expect(await screen.findByLabelText(/Coin From/)).toBeInTheDocument();
    });
  });

  it("should have positions on pool preview", async () => {
    renderWithRouter(<App />, { route: "/pool/list" });
    const noPositions = await screen.findByText(/pooled eth/i);
    expect(noPositions).toBeInTheDocument();
  });
});
