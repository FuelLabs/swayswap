import {
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from "@swayswap/test-utils";
import Decimal from "decimal.js";
import type { Wallet } from "fuels";

import * as poolHelpers from "../../Pool/utils/helpers";
import * as swapHelpers from "../utils/helpers";

import { App } from "~/App";
import { TOKENS } from "~/systems/Core";
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
    fireEvent.click(button[0]);
  });
}

async function createAndMockWallet() {
  const wallet = createWallet();
  mockUseWallet(wallet);
  return wallet;
}

async function fillCoinFromWithValue(value: string) {
  await waitFor(async () => {
    const coinFrom = screen.getByLabelText(/Coin from input/i);
    fireEvent.change(coinFrom, { target: { value } });
  });
}

describe("SwapPage", () => {
  describe("without liquidity", () => {
    beforeAll(async () => {
      const wallet = await createAndMockWallet();
      await faucet(wallet, 3);
    });

    it("should swap button be disabled", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      const submitBtn = await findSwapBtn();
      await waitFor(() => {
        expect(submitBtn).toBeDisabled();
        expect(submitBtn.textContent).toMatch(/enter amount/i);
      });
    });

    it("should show balance correctly", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      const balances = await screen.findAllByText(/(balance:)\s([1-9])/i);
      expect(balances[0].textContent).toMatch("1");
    });

    function getFirstCoinSelectTextContent() {
      return screen.getAllByLabelText(/coin selector/i)[0].textContent;
    }

    it("should show a select coin button first", async () => {
      renderWithRouter(<App />, { route: "/swap" });

      await waitFor(async () =>
        expect(screen.getByText(/select token/i)).toBeInTheDocument()
      );
    });

    it("should invert coin selector when click on invert", async () => {
      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      const invertBtn = screen.getByLabelText("Invert coins");
      await waitFor(async () => expect(invertBtn).toBeInTheDocument());

      expect(getFirstCoinSelectTextContent()).toMatch(/ether/i);
      fireEvent.click(invertBtn);
      expect(getFirstCoinSelectTextContent()).toMatch(/dai/i);
      fireEvent.click(invertBtn);
    });

    it("should show insufficient eth for gas message", async () => {
      const spy = jest
        .spyOn(swapHelpers, "hasEnoughBalance")
        .mockReturnValue(true);

      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      await fillCoinFromWithValue("1000");
      const submitBtn = await findSwapBtn();
      await waitFor(() => {
        expect(submitBtn.textContent).toMatch(/insufficient ETH for gas/i);
      });

      spy.mockRestore();
    });
  });

  describe("with eth for gas", () => {
    let wallet: Wallet;

    beforeAll(async () => {
      wallet = await createAndMockWallet();
      await faucet(wallet, 4);
    });

    it("should show insufficient balance if try to input more than balance", async () => {
      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      await fillCoinFromWithValue("1000");
      const submitBtn = await findSwapBtn();
      await waitFor(() => {
        expect(submitBtn.textContent).toMatch(
          /(Insufficient)(\s\w+\s)(balance)/i
        );
      });
    });

    it("should fill input value with max balance when click on max", async () => {
      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      await clickOnMaxBalance();
      const coinFrom = screen.getByLabelText(/Coin from input/i);
      const inputValue = coinFrom.getAttribute("value");
      const valDecimal = new Decimal(inputValue || "");
      expect(valDecimal.round().toString()).toMatch(/2/);
    });

    it("should show no pool found message when there is no pool reserve", async () => {
      const spy = jest.spyOn(poolHelpers, "getPoolRatio").mockReturnValue(0);
      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      await fillCoinFromWithValue("0.5");
      const submitBtn = await findSwapBtn();
      await waitFor(async () => {
        expect(submitBtn.textContent).toMatch(/no pool found/i);
        expect(spy).toHaveBeenCalled();
      });

      spy.mockRestore();
    });
  });

  describe("with liquidity created", () => {
    let wallet: Wallet;

    beforeAll(async () => {
      wallet = await createAndMockWallet();
      await faucet(wallet, 6);
      await mint(wallet);
      await addLiquidity(
        wallet,
        "1",
        "1000",
        TOKENS[0].assetId,
        TOKENS[1].assetId
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should show insufficient liquidity when amount is greater than liquidity", async () => {
      const spy1 = jest
        .spyOn(swapHelpers, "hasEnoughBalance")
        .mockReturnValue(true);

      const spy2 = jest
        .spyOn(swapHelpers, "hasEthForNetworkFee")
        .mockReturnValue(true);

      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      await fillCoinFromWithValue("100000");
      const submitBtn = await findSwapBtn();
      await waitFor(async () => {
        expect(submitBtn.textContent).toMatch(/insufficient liquidity/i);
      });

      spy1.mockRestore();
      spy2.mockRestore();
    });

    it("should show expected output after input value", async () => {
      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      await fillCoinFromWithValue("0.5");
      await waitFor(async () => {
        const output = screen.getByText(/expected out/i);
        expect(output).toBeInTheDocument();
      });
    });

    it("should show price per token information", async () => {
      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

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
      renderWithRouter(<App />, { route: "/swap?coinTo=DAI" });

      await fillCoinFromWithValue("0.5");
      await waitFor(async () => {
        const coinTo = screen.getByLabelText(/Coin to input/i);
        const value = parseFloat(coinTo.getAttribute("value") || "0");
        expect(value).toBeGreaterThan(1);
      });
    });
  });
});
