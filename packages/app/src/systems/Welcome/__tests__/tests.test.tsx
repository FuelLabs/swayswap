import { fireEvent, screen, waitFor } from "@fuels-ui/test-utils";

export const checkFirstLoad = async () => {
  const createWalletBtn = await screen.findByRole("button", {
    name: "welcome-create-wallet-btn",
  });
  expect(createWalletBtn).toBeInTheDocument();
};

export const createWallet = async () => {
  const createWalletBtn = await screen.findByRole("button", {
    name: "welcome-create-wallet-btn",
  });
  expect(createWalletBtn).toBeInTheDocument();
  fireEvent.click(createWalletBtn);

  await waitFor(async () => {
    const addFundsBtn = await screen.findByRole("button", {
      name: "Give me ETH",
    });
    expect(addFundsBtn).toBeInTheDocument();
    fireEvent.click(addFundsBtn);
  });

  const goToSwapBtn = await screen.findByRole("button", {
    name: "Go to Swap",
  });
  expect(goToSwapBtn).toBeInTheDocument();

  // need to wait to navigate
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  fireEvent.click(goToSwapBtn);

  await waitFor(async () => {
    const swapBtn = await screen.findByText(/Enter amount/i);
    expect(swapBtn).toBeInTheDocument();
  });
};
