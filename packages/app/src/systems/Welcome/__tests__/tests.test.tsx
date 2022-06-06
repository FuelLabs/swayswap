// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen, waitFor } from "@fuels-ui/test-utils";

export const checkFirstLoad = async () => {
  const createWalletBtn = await screen.findByTestId("createWalletBtn");
  expect(createWalletBtn).toBeInTheDocument();
};

export const createWallet = async () => {
  const createWalletBtn = await screen.findByTestId("createWalletBtn");
  expect(createWalletBtn).toBeInTheDocument();
  fireEvent.click(createWalletBtn);

  await waitFor(async () => {
    const addFundsBtn = await screen.findByTestId("addFundsBtn");
    expect(addFundsBtn).toBeInTheDocument();
    fireEvent.click(addFundsBtn);
  });

  await waitFor(async () => {
    const goToSwapBtn = await screen.findByTestId("goToSwapBtn");
    expect(goToSwapBtn).toBeInTheDocument();
  });

  // need to wait to navigate
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  const goToSwapBtn = await screen.findByTestId("goToSwapBtn");
  fireEvent.click(goToSwapBtn);

  await waitFor(async () => {
    const swapBtn = await screen.findByText(/Enter amount/i);
    expect(swapBtn).toBeInTheDocument();
  });
};
