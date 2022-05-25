import { renderWithRouter, screen, waitFor } from "@fuels-ui/test-utils";
import { Wallet } from "fuels";

import App from "~/App";
import { FUEL_PROVIDER_URL } from "~/config";

const { privateKey } = Wallet.generate({ provider: FUEL_PROVIDER_URL });
const wallet = new Wallet(privateKey, FUEL_PROVIDER_URL);

jest.mock("../../hooks/useWallet", () => ({
  useWallet: jest.fn(() => wallet),
}));

describe("PoolPreviews()", () => {
  it("should render with no position first", async () => {
    const { user } = renderWithRouter(<App />);

    await waitFor(async () => {
      const poolBtn = await screen.getByText("Pool");
      await user.click(poolBtn);
    });

    expect(
      screen.getByText(/You may have no open positions/)
    ).toBeInTheDocument();
  });

  it("should be able to add liquidity", async () => {
    const { user } = renderWithRouter(<App />);

    await waitFor(async () => {
      const poolBtn = screen.getByText("Pool");
      await user.click(poolBtn);
    });

    await waitFor(async () => {
      const addLiquidityBtn = screen.getByText("Add Liquidity");
      await user.click(addLiquidityBtn);
    });

    expect(screen.getByText(/Enter Ether amount/)).toBeInTheDocument();
  });
});
