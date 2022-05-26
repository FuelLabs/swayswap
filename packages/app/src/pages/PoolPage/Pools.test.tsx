import { renderWithRouter, screen } from "@fuels-ui/test-utils";

import App from "~/App";

describe("Pooo", () => {
  it("should render a basic ", () => {
    renderWithRouter(<App />, { route: "/pool/list" });
    expect(screen.getByAltText("swayswap")).toBeInTheDocument();
  });
});
