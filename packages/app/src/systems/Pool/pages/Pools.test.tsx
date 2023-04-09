import { screen, renderWithRouter } from "@swayswap/test-utils";

import { App } from "~/App";
import { mockUserData } from "~/systems/Core/hooks/__mocks__/useWallet";

describe("Pool List", () => {
  beforeEach(() => {
    mockUserData();
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
