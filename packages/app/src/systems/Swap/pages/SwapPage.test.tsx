import {
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from "@swayswap/test-utils";
import type { Wallet } from "fuels";

import { App } from "~/App";
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
    let wallet: Wallet;

    beforeAll(async () => {
      wallet = await createAndMockWallet();
      await faucet(wallet, 4);
      await mint(wallet);
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
  });
});
