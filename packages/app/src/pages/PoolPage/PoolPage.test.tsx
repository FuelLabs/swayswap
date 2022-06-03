import "cross-fetch/polyfill";
import { fireEvent, screen, waitFor } from "@fuels-ui/test-utils";

import { createWallet } from "../WelcomePage/WalletPage.test";

export const openPoolList = async () => {
  await waitFor(async () => {
    const poolMenuBtn = await screen.findByTestId("poolMenuBtn");
    expect(poolMenuBtn).toBeInTheDocument();
    fireEvent.click(poolMenuBtn);
  });

  await waitFor(async () => {
    const headerAddLiquidityBtn = await screen.findByTestId(
      "headerAddLiquidityBtn"
    );
    expect(headerAddLiquidityBtn).toBeInTheDocument();
  });
};

export const openAddLiquidity = async () => {
  await waitFor(async () => {
    const headerAddLiquidityBtn = await screen.findByTestId(
      "headerAddLiquidityBtn"
    );
    expect(headerAddLiquidityBtn).toBeInTheDocument();
    fireEvent.click(headerAddLiquidityBtn);
  });

  await waitFor(async () => {
    const addLiquiditySubmitBtn = await screen.findByTestId(
      "addLiquiditySubmitBtn"
    );
    expect(addLiquiditySubmitBtn).toBeInTheDocument();
  });
};

describe("PoolPage", () => {
  it("should validate pool flow", async () => {
    await createWallet();
    await openPoolList();

    await waitFor(async () => {
      const noPositions = await screen.findByText(/no open positions/i);
      expect(noPositions).toBeInTheDocument();
    });

    await openAddLiquidity();

    await waitFor(async () => {
      const submitBtn = await screen.findByText(/Enter Ether amount/);
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toBeDisabled();
    });

    const coinFromInput = await screen.getByLabelText(/Coin From Input/);
    const coinToInput = await screen.getByLabelText(/Coin To Input/);
    expect(coinFromInput).toBeInTheDocument();
    expect(coinToInput).toBeInTheDocument();
  });
});
