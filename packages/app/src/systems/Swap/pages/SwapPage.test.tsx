import "cross-fetch/polyfill";
import type { FuelWalletLocked } from "@fuel-wallet/sdk";
import {
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from "@swayswap/test-utils";
import Decimal from "decimal.js";

import * as poolHelpers from "../../Pool/utils/helpers";
import * as swapHelpers from "../utils/helpers";

import { App } from "~/App";
import {
  clearMockUserData,
  mockUserData,
} from "~/systems/Core/hooks/__mocks__/useWallet";
import { faucet } from "~/systems/Faucet/hooks/__mocks__/useFaucet";

async function findSwapBtn() {
  return waitFor(() => screen.findByLabelText(/swap button/i));
}

async function findMaxBalanceBtn(input: "from" | "to" = "from") {
  const button = await screen.findAllByLabelText(/Set Maximum Balance/i);
  return button[input === "from" ? 0 : 1];
}

async function clickOnMaxBalance(input: "from" | "to" = "from") {
  return waitFor(async () => {
    const button = await findMaxBalanceBtn(input);
    fireEvent.click(button);
  });
}

async function fillCoinFromWithValue(value: string) {
  await waitFor(
    async () => {
      const coinFrom = screen.getByLabelText(/Coin from input/i);
      fireEvent.change(coinFrom, { target: { value } });
    },
    { timeout: 10000 }
  );
}

async function fillCoinToWithValue(value: string) {
  await waitFor(async () => {
    const coinFrom = screen.getByLabelText(/Coin to input/i);
    fireEvent.change(coinFrom, { target: { value } });
  });
}

async function waitFinishLoading() {
  await waitFor(async () => {
    const submitBtn = await findSwapBtn();
    expect(submitBtn.textContent).toMatch("Loading...");
  });

  await waitFor(async () => {
    const submitBtn = await findSwapBtn();
    expect(submitBtn.textContent).not.toMatch("Loading...");
  });
}

async function getETHBalance() {
  const balanceLabel = await screen.findByLabelText("sETH balance");
  const balance = parseInt(balanceLabel.lastChild?.textContent || "0", 10);
  const valBalance = new Decimal(balance);

  return valBalance;
}

describe("SwapPage", () => {
  let wallet: FuelWalletLocked;

  beforeAll(async () => {
    const mocks = await mockUserData({
      faucetQuantity: 4,
    });
    wallet = mocks.wallet;
  }, 1000 * 60);

  afterAll(() => {
    clearMockUserData();
  });

  describe("without liquidity", () => {
    beforeAll(async () => {
      await faucet(wallet, 4);
    });

    it("should swap button be disabled", async () => {
      renderWithRouter(<App />, { route: "/swap" });
      await waitFor(async () => {
        const submitBtn = await findSwapBtn();
        expect(submitBtn).toBeDisabled();
      });
    });

    it("should show balance correctly", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await waitFor(async () => {
        const sethBalance = await screen.getByLabelText("sETH balance");
        expect(sethBalance).toHaveTextContent("0.500");
        const daiBalance = await screen.getByLabelText("DAI balance");
        expect(daiBalance).toHaveTextContent("500.000");
      });
    });

    function getFirstCoinSelectTextContent() {
      return screen.getAllByLabelText(/coin selector/i)[0].textContent;
    }

    it("should invert coin selector when click on invert", async () => {
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });
      await waitFor(() => {
        expect(
          screen.queryByTestId("fuel-wallet-loading")
        ).not.toBeInTheDocument();
      });

      const invertBtn = screen.getByLabelText("Invert coins");

      await waitFor(async () => {
        expect(getFirstCoinSelectTextContent()).toMatch(/ether/i);
        fireEvent.click(invertBtn);
        expect(getFirstCoinSelectTextContent()).toMatch(/dai/i);
        fireEvent.click(invertBtn);
        expect(invertBtn).toBeInTheDocument();
      });
    });

    it("should show no pool found message when there is no pool reserve", async () => {
      const spy = jest
        .spyOn(poolHelpers, "getPoolRatio")
        .mockReturnValue(new Decimal(0));
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });

      await waitFor(async () => {
        await fillCoinFromWithValue("0.5");
        const submitBtn = await findSwapBtn();
        expect(submitBtn.textContent).toMatch(/no pool found/i);
        expect(spy).toHaveBeenCalled();
      });

      spy.mockRestore();
    });
  });

  describe("with liquidity created", () => {
    beforeAll(async () => {
      const mocks = await mockUserData({
        faucetQuantity: 4,
      });
      wallet = mocks.wallet;
    }, 1000 * 60);

    afterAll(() => {
      clearMockUserData();
    });

    it("should show insufficient balance if try to input more than balance", async () => {
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });

      await waitFor(
        async () => {
          await fillCoinFromWithValue("2");
          const submitBtn = await findSwapBtn();
          expect(submitBtn.textContent).toMatch(
            /(Insufficient)(\s\w+\s)(balance)/i
          );
        },
        { timeout: 10000 }
      );
    });

    it("should fill input value with max balance when click on max", async () => {
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });

      await clickOnMaxBalance();
      const coinFrom = screen.getByLabelText(/Coin from input/i);
      const inputValue = coinFrom.getAttribute("value");
      const valDecimal = new Decimal(inputValue || "");
      const balance = await getETHBalance();

      expect(valDecimal.toString()).toMatch(balance.toString());
    });

    it("should show insufficient liquidity when amount is greater than liquidity", async () => {
      const spy1 = jest
        .spyOn(swapHelpers, "hasEnoughBalance")
        .mockReturnValue(true);

      const spy2 = jest
        .spyOn(swapHelpers, "hasEthForNetworkFee")
        .mockReturnValue(true);

      renderWithRouter(<App />, { route: "/swap?from=DAI&to=sETH" });

      await waitFor(
        async () => {
          await fillCoinToWithValue("10000000000.0");
          const submitBtn = await findSwapBtn();
          expect(submitBtn.textContent).toMatch(/insufficient liquidity/i);
        },
        { timeout: 10000 }
      );

      spy1.mockRestore();
      spy2.mockRestore();
    });

    it("should show expected output after input value", async () => {
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });

      await waitFor(async () => {
        await fillCoinFromWithValue("0.5");
        const output = screen.getByText(/expected out/i);
        expect(output).toBeInTheDocument();
      });
    });

    it("should show price per token information", async () => {
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });

      await clickOnMaxBalance();

      let pricePerToken: HTMLElement;
      const ethToDaiRegexp = /(\d+)(\s)(sETH = )([\d,]+).((\s)|(\d+\s))DAI/i;
      const daiToEthRegexp = /(\d+)(\s)(DAI = )([\d,]+).((\s)|(\d+\s))sETH/i;

      pricePerToken = await screen.findByLabelText(/price per token/i);
      await waitFor(async () => {
        expect(pricePerToken.textContent).toMatch(ethToDaiRegexp);
      });

      const inverPriceBtn = await screen.findByLabelText(/invert token price/i);
      fireEvent.click(inverPriceBtn);

      pricePerToken = await screen.findByLabelText(/price per token/i);
      await waitFor(async () => {
        expect(pricePerToken.textContent).toMatch(daiToEthRegexp);
      });
    });

    it("should set automatically coin to input based on coin from value", async () => {
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });

      await waitFor(
        async () => {
          await fillCoinFromWithValue("0.5");
          const coinTo = screen.getByLabelText(/Coin to input/i);
          const value = parseFloat(coinTo.getAttribute("value") || "0");
          expect(value).toBeGreaterThan(1);
        },
        { timeout: 10000 }
      );
    });

    it("should disable max button after setting max FROM balance", async () => {
      renderWithRouter(<App />, { route: "/swap?from=sETH&to=DAI" });

      await waitFinishLoading();
      await clickOnMaxBalance();

      await waitFor(async () => {
        const maxBalanceBtn = await findMaxBalanceBtn();
        expect(maxBalanceBtn.getAttribute("aria-disabled")).toEqual("true");
      });
    });
  });
});
