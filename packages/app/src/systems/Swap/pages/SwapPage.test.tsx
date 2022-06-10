import {
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from "@swayswap/test-utils";
import type { Wallet } from "fuels";
import toast from "react-hot-toast";

import { App } from "~/App";
import { DECIMAL_UNITS } from "~/config";
import { parseToFormattedNumber, parseUnits } from "~/systems/Core";
import {
  createWallet,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";
import { faucet } from "~/systems/Faucet/hooks/__mocks__/useFaucet";
import { mint } from "~/systems/Mint/hooks/__mocks__/useMint";
import { addLiquidity } from "~/systems/Pool/hooks/__mocks__/useAddLiquidity";

async function findSwapBtn() {
  return waitFor(() => screen.findByLabelText(/swap button/i));
}

async function clickOnMaxBalance() {
  return waitFor(async () => {
    const button = await screen.findAllByRole("button", { name: /max/i });
    expect(button.length).toBe(2);
    fireEvent.click(button[0]);
  });
}

async function createAndMockWallet() {
  const wallet = createWallet();
  mockUseWallet(wallet);
  return wallet;
}

async function getFormattedBalance(wallet: Wallet) {
  const balance = await wallet.getBalance();
  return parseToFormattedNumber(balance);
}

describe("SwapPage", () => {
  describe("without liquidity", () => {
    beforeAll(async () => {
      const wallet = await createAndMockWallet();
      await faucet(wallet, 3);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should swap button be disabled", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      const submitBtn = await findSwapBtn();
      expect(submitBtn).toBeDisabled();
      expect(submitBtn.textContent).toMatch(/enter amount/i);
    });

    it("should show balance correctly", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      const balances = await screen.findAllByText(/(balance:)\s([1-9])/i);
      expect(balances[0].textContent).toMatch("1");
    });

    function getFirstCoinSelectTextContent() {
      return screen.getAllByLabelText("Coin Selector")[0].textContent;
    }

    it("should invert coin selector when click on invert", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      const invertBtn = screen.getByLabelText("Invert coins");
      await waitFor(async () => expect(invertBtn).toBeInTheDocument());

      expect(getFirstCoinSelectTextContent()).toMatch(/ether/i);
      fireEvent.click(invertBtn);
      expect(getFirstCoinSelectTextContent()).toMatch(/dai/i);
      fireEvent.click(invertBtn);
    });

    it("should show insufficient token amount if try to input more than balance", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await waitFor(async () => {
        const coinFrom = screen.getByLabelText(/Coin from input/i);
        fireEvent.change(coinFrom, { target: { value: "1000" } });
      });

      const submitBtn = await findSwapBtn();
      expect(submitBtn.textContent).toMatch(
        /(Insufficient)(\s\w+\s)(balance)/i
      );
    });

    it("should fill input value with max balance when click on max", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await clickOnMaxBalance();
      const coinFrom = screen.getByLabelText(/Coin from input/i);
      const inputValue = coinFrom.getAttribute("value");
      expect(inputValue).toMatch(/1/);
    });

    it("should show insufficient liquidity message when there is no pool reserve", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await waitFor(async () => {
        const coinFrom = screen.getByLabelText(/Coin from input/i);
        fireEvent.change(coinFrom, { target: { value: "0.5" } });
      });

      const submitBtn = await findSwapBtn();
      expect(submitBtn.textContent).toMatch(/insufficient liquidity/i);
    });
  });

  describe("with liquidity created", () => {
    const mintValue = parseUnits("2000", DECIMAL_UNITS).toBigInt();
    let wallet: Wallet;

    beforeAll(async () => {
      wallet = await createAndMockWallet();
      await faucet(wallet, 4);
      await mint(wallet, mintValue);
      await addLiquidity(wallet, "0.5", "1000");
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should show expected output after input value", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await waitFor(async () => {
        const coinFrom = screen.getByLabelText(/Coin from input/i);
        fireEvent.change(coinFrom, { target: { value: "0.5" } });
        const output = screen.getByText(/expected out/i);
        expect(output).toBeInTheDocument();
      });
    });

    it("should show price per token information", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await clickOnMaxBalance();

      let pricePerToken: HTMLElement;
      const ethToDaiRegexp = /(\d+)(\s)(ETH = )(\d+).((\s)|(\d+\s))DAI/i;
      const daiToEthRegexp = /(\d+)(\s)(DAI = )(\d+).((\s)|(\d+\s))ETH/i;

      pricePerToken = await screen.findByLabelText(/price per token/i);
      expect(pricePerToken.textContent).toMatch(ethToDaiRegexp);

      const inverPriceBtn = await screen.findByLabelText(/invert token price/i);
      fireEvent.click(inverPriceBtn);

      pricePerToken = await screen.findByLabelText(/price per token/i);
      expect(pricePerToken.textContent).toMatch(daiToEthRegexp);
    });

    it("should set automatically coin to input based on coin from value", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await waitFor(async () => {
        const coinFrom = screen.getByLabelText(/Coin from input/i);
        fireEvent.change(coinFrom, { target: { value: "0.5" } });
        const coinTo = screen.getByLabelText(/Coin to input/i);
        const value = parseFloat(coinTo.getAttribute("value") || "0");
        expect(value).toBeGreaterThan(1);
      });
    });

    it("should swap between two tokens", async () => {
      const spy = jest.spyOn(toast, "success");
      const amount = 0.5;
      // As we don't have a way to access a good estimate of gas fee
      // we use a max gas cost
      const gasFeeEstimateMax = 0.01;
      const currentBalance = Number(await getFormattedBalance(wallet));
      expect(currentBalance).toBeGreaterThan(1);

      renderWithRouter(<App />, {
        route: "/swap",
      });

      await waitFor(async () => {
        const coinFrom = await screen.findByLabelText(/Coin from input/i);
        fireEvent.change(coinFrom, { target: { value: String(amount) } });
        expect(coinFrom.getAttribute("value")).toBe(String(amount));

        const swapBtn = await screen.findByLabelText(/swap button/i);
        expect(swapBtn).not.toBeDisabled();
        expect(swapBtn.textContent).toMatch(/Swap/i);
        fireEvent.click(swapBtn);
      });

      await waitFor(async () => {
        expect(spy).toBeCalled();
        const afterBalance = Number(await getFormattedBalance(wallet));
        expect(afterBalance).toBeGreaterThan(
          currentBalance - amount - gasFeeEstimateMax
        );
      });
    });
  });
});
