import type { Fuel, FuelWalletLocked } from "@fuel-wallet/sdk";
import { screen, renderWithRouter } from "@swayswap/test-utils";

import { mockUseUserPosition } from "../hooks/__mocks__/useUserPosition";

import { App } from "~/App";
import {
  createWallet,
  mockUseFuel,
  mockUseWallet,
} from "~/systems/Core/hooks/__mocks__/useWallet";

let wallet: FuelWalletLocked;
let fuel: Fuel;

beforeAll(async () => {
  ({ wallet, fuel } = await createWallet());
  mockUseWallet(wallet);
  mockUseFuel(fuel);
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
