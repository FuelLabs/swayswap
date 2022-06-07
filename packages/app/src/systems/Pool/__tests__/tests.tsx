import { fireEvent, screen, waitFor } from "@fuels-ui/test-utils";

export const openPoolList = async () => {
  // start point: initial page

  const poolMenuBtn = await screen.findByRole("button", {
    name: "Pool",
  });
  expect(poolMenuBtn).toBeInTheDocument();
  fireEvent.click(poolMenuBtn);

  const headerAddLiquidityBtn = await screen.findByRole("button", {
    name: "header-add-liquidity-btn",
  });
  expect(headerAddLiquidityBtn).toBeInTheDocument();
};

export const openAddLiquidity = async () => {
  // start point: pool list
  const headerAddLiquidityBtn = await screen.findByRole("button", {
    name: "header-add-liquidity-btn",
  });
  expect(headerAddLiquidityBtn).toBeInTheDocument();
  fireEvent.click(headerAddLiquidityBtn);

  const addLiquiditySubmitBtn = await screen.findByRole("button", {
    name: "add-liquidity-submit-btn",
  });
  expect(addLiquiditySubmitBtn).toBeInTheDocument();
};

export const validateNoOpenPosition = async () => {
  // start point: pool list
  const noPositions = await screen.findByText(/no open positions/i);
  await expect(noPositions).toBeInTheDocument();
};

export const validateNewPoolMessage = async () => {
  // start point: add liquidity

  const newPoolMessage = await screen.findByText(/You are creating a new pool/);
  expect(newPoolMessage).toBeInTheDocument();
};

export const validateNewPoolInputsNoRatio = async () => {
  // start point: add liquidity
  const coinFromInput = screen.getByLabelText(/Coin From Input/);
  const coinToInput = screen.getByLabelText(/Coin To Input/);

  const newCoinFromValue = "10";
  await fireEvent.change(coinFromInput, {
    target: {
      value: newCoinFromValue,
    },
  });

  const newCoinToValue = "1000";
  await fireEvent.change(coinToInput, {
    target: {
      value: newCoinToValue,
    },
  });

  await waitFor(async () => {
    expect(coinFromInput).toHaveValue(newCoinFromValue);
    expect(coinToInput).toHaveValue(newCoinToValue);
  });
};

export const validateButtonInformFromAmount = async () => {
  // start point: add liquidity
  const submitBtn = await screen.findByText(/Enter Ether amount/);
  expect(submitBtn).toBeInTheDocument();
  expect(submitBtn).toBeDisabled();
};

export const validateButtonInformToAmount = async () => {
  // start point: add liquidity
  const coinFromInput = screen.getByLabelText(/Coin From Input/);
  await fireEvent.change(coinFromInput, {
    target: {
      value: "10",
    },
  });

  const submitBtn = await screen.findByText(/Enter DAI amount/);
  expect(submitBtn).toBeInTheDocument();
  expect(submitBtn).toBeDisabled();
};

export const validateButtonInsufficientFromBalance = async () => {
  // start point: add liquidity
  const coinFromInput = screen.getByLabelText(/Coin From Input/);
  await fireEvent.change(coinFromInput, {
    target: {
      value: "10",
    },
  });
  const coinToInput = screen.getByLabelText(/Coin To Input/);
  await fireEvent.change(coinToInput, {
    target: {
      value: "1000",
    },
  });

  const submitBtn = await screen.findByText(/Insufficient Ether balance/);
  expect(submitBtn).toBeInTheDocument();
  expect(submitBtn).toBeDisabled();
};

export const validateButtonInsufficientToBalance = async () => {
  // start point: add liquidity
  const coinFromInput = screen.getByLabelText(/Coin From Input/);
  await fireEvent.change(coinFromInput, {
    target: {
      value: "0.1",
    },
  });
  const coinToInput = screen.getByLabelText(/Coin To Input/);
  await fireEvent.change(coinToInput, {
    target: {
      value: "1000",
    },
  });

  const submitBtn = await screen.findByText(/Insufficient DAI balance/);
  expect(submitBtn).toBeInTheDocument();
  expect(submitBtn).toBeDisabled();
};

export const validateButtonInputsRight = async () => {
  // start point: add liquidity
  const coinFromInput = screen.getByLabelText(/Coin From Input/);
  await fireEvent.change(coinFromInput, {
    target: {
      value: "0.5",
    },
  });
  const coinToInput = screen.getByLabelText(/Coin To Input/);
  await fireEvent.change(coinToInput, {
    target: {
      value: "2000",
    },
  });

  const submitBtn = await screen.findByText(/Create liquidity/);
  expect(submitBtn).toBeInTheDocument();
};

export const createLiquidity = async () => {
  // start point: add liquidity

  let hasPoolCreated;

  try {
    await screen.findByText(/Current pool reserves/i);
    hasPoolCreated = true;
  } catch (e) {
    hasPoolCreated = false;
  }
  if (hasPoolCreated) {
    expect(true);
    return;
  }

  const coinFromInput = await screen.findByLabelText(/Coin From Input/);
  await fireEvent.change(coinFromInput, {
    target: {
      value: "0.1",
    },
  });
  const coinToInput = await screen.findByLabelText(/Coin To Input/);
  await fireEvent.change(coinToInput, {
    target: {
      value: "500",
    },
  });

  const submitBtn = await screen.findByText(/Create liquidity/);
  expect(submitBtn).toBeInTheDocument();

  fireEvent.click(submitBtn);

  const successFeedback = await screen.findByText(/New pool created/);
  expect(successFeedback).toBeInTheDocument();
};
