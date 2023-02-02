import type { FuelWalletLocked } from "@fuel-wallet/sdk";
import { screen, renderWithRouter } from "@swayswap/test-utils";

import { mockUseUserPosition } from "../hooks/__mocks__/useUserPosition";

import { App } from "~/App";
import {
  createWallet,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";

let wallet: FuelWalletLocked;

beforeAll(async () => {
  wallet = await createWallet();
  mockUseWallet(wallet);
});

describe("Pool List", () => {
  beforeEach(() => {
    mockUseUserPosition();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render with no position first", async () => {
    renderWithRouter(<App />, { route: "/pool/list" });

    const noPositions = await screen.findByText(
      /you do not have any open positions/i
    );
    expect(noPositions).toBeInTheDocument();
  });
});
