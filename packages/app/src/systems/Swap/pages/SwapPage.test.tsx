import {
  fireEvent,
  renderWithRouter,
  screen,
  waitFor,
} from "@swayswap/test-utils";
import type { Wallet } from "fuels";

import { App } from "~/App";
import { DECIMAL_UNITS } from "~/config";
import { parseUnits } from "~/systems/Core";
import { mockUseBalances } from "~/systems/Core/hooks/__mocks__/useBalances";
import {
  createWallet,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";
import { faucet } from "~/systems/Faucet/hooks/__mocks__/useFaucet";
import { mint } from "~/systems/Mint/hooks/__mocks__/useMint";
import { addLiquidity } from "~/systems/Pool/hooks/__mocks__/useAddLiquidity";

function findSwapBtn() {
  return screen.findByLabelText(/swap button/i);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function clickOnMaxBalance(user: any) {
  await waitFor(async () => {
    const btn = await screen.findAllByRole("button", { name: /max/i });
    expect(btn.length).toBe(2);
    await user.click(btn[0]);
  });
}

describe.only("SwapPage", () => {
  let wallet: Wallet;

  beforeAll(() => {
    wallet = createWallet();
    mockUseWallet(wallet);
  });

  beforeEach(() => {
    mockUseBalances();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should swap button be disabled", async () => {
    renderWithRouter(<App justContent />, { route: "/swap" });

    await waitFor(async () => {
      const submitBtn = await findSwapBtn();
      expect(submitBtn).toBeDisabled();
      expect(submitBtn.textContent).toMatch(/enter amount/i);
    });
  });

  it("should show balance correclty", async () => {
    renderWithRouter(<App justContent />, { route: "/swap" });

    await waitFor(async () => {
      const btn = await screen.findByText("Balance: 1.0");
      expect(btn).toBeInTheDocument();
    });
  });

  function getFirstCoinSelectTextContent() {
    return screen.getAllByLabelText("Coin Selector")[0].textContent;
  }

  it("should invert input when click on invert", async () => {
    const { user } = renderWithRouter(<App justContent />, { route: "/swap" });

    const invertBtn = screen.getByLabelText("Invert coins");
    await waitFor(async () => expect(invertBtn).toBeInTheDocument());

    expect(getFirstCoinSelectTextContent()).toMatch(/ether/i);
    await user.click(invertBtn);
    expect(getFirstCoinSelectTextContent()).toMatch(/dai/i);
    await user.click(invertBtn);
  });

  it("should show insufficient liquidity message when there is no pool reserve", async () => {
    const { user } = renderWithRouter(<App justContent />, { route: "/swap" });

    await waitFor(async () => {
      const coinFrom = await screen.findByLabelText(/Coin from input/i);
      await user.type(coinFrom, "0.5");
    });

    const submitBtn = await findSwapBtn();
    expect(submitBtn.textContent).toMatch(/insufficient liquidity/i);
  });

  it("should show insufficient token amount if try to input more than balance", async () => {
    renderWithRouter(<App justContent />, { route: "/swap" });

    await waitFor(async () => {
      const coinFrom = await screen.findByLabelText(/Coin from input/i);
      fireEvent.change(coinFrom, {
        target: {
          value: "1000",
        },
      });
    });

    const submitBtn = await findSwapBtn();
    expect(submitBtn.textContent).toMatch(/(Insufficient)(\s\w+\s)(balance)/i);
  });

  it("should fill input value with max balance when click on max", async () => {
    const { user } = renderWithRouter(<App justContent />, { route: "/swap" });

    await clickOnMaxBalance(user);
    const coinFrom = await screen.findByLabelText(/Coin from input/i);
    const inputValue = coinFrom.getAttribute("value");
    expect(inputValue).toMatch(/0.99/);
  });

  it("should show expected output after input value", async () => {
    const { user } = renderWithRouter(<App justContent />, { route: "/swap" });

    await clickOnMaxBalance(user);
    const output = await screen.findByText(/expected out/i);
    expect(output).toBeInTheDocument();
  });

  it("should show price per token information", async () => {
    const { user } = renderWithRouter(<App justContent />, { route: "/swap" });

    await clickOnMaxBalance(user);
    let pricePerToken: HTMLElement;

    pricePerToken = await screen.findByLabelText(/price per token/i);
    expect(pricePerToken.textContent).toMatch(
      /(\d+)(\s)(ETH = )(\d+).((\s)|(\d+\s))DAI/i
    );

    const inverPriceBtn = await screen.findByLabelText(/invert token price/i);
    await user.click(inverPriceBtn);

    pricePerToken = await screen.findByLabelText(/price per token/i);
    expect(pricePerToken.textContent).toMatch(
      /(\d+)(\s)(DAI = )(\d+).((\s)|(\d+\s))ETH/i
    );
  });

  const MINT_VALUE = parseUnits("4000", DECIMAL_UNITS).toBigInt();

  it("should swap between two tokens", async () => {
    jest.unmock("../../Core/hooks/useBalances.ts");

    await Promise.all(Array.from({ length: 10 }).map(() => faucet(wallet)));
    await mint(wallet, MINT_VALUE);
    await addLiquidity(wallet);

    const { user } = renderWithRouter(<App justContent />, { route: "/swap" });

    await waitFor(async () => {
      const coinFrom = await screen.findByLabelText(/Coin from input/i);
      await user.type(coinFrom, "0.3");
    });

    await waitFor(() => {
      const coinTo = screen.getByLabelText(/Coin to input/i);
      const value = parseFloat(coinTo.getAttribute("value") || "0");
      expect(value).toBeGreaterThan(10);
    });

    const swapBtn = await findSwapBtn();
    expect(swapBtn.textContent).toMatch(/Swap/i);
    await user.click(swapBtn);

    await waitFor(async () => {
      expect(
        await screen.findByText(/Swap made successfully/i)
      ).toBeInTheDocument();
    });
  });
});
