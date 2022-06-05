import { fireEvent, screen, waitFor } from "@fuels-ui/test-utils";

export const openPoolList = async () => {
  // start point: initial(swap) page
  await waitFor(async () => {
    const poolMenuBtn = await screen.findByTestId("poolMenuBtn");
    expect(poolMenuBtn).toBeInTheDocument();
    fireEvent.click(poolMenuBtn);
  });

  await waitFor(async () => {
    const headerAddLiquidityBtn = await screen.findByTestId(
      "headerAddLiquidityBtn"
    );
    expect(headerAddLiquidityBtn).toBeInTheDocument();
  });
};

export const openAddLiquidity = async () => {
  // start point: pool list
  await waitFor(async () => {
    const headerAddLiquidityBtn = await screen.findByTestId(
      "headerAddLiquidityBtn"
    );
    expect(headerAddLiquidityBtn).toBeInTheDocument();
    fireEvent.click(headerAddLiquidityBtn);
  });

  await waitFor(async () => {
    const addLiquiditySubmitBtn = await screen.findByTestId(
      "addLiquiditySubmitBtn"
    );
    expect(addLiquiditySubmitBtn).toBeInTheDocument();
  });
};

export const validateNoOpenPosition = async () => {
  // start point: pool list
  await waitFor(async () => {
    const noPositions = await screen.findByText(/no open positions/i);
    await expect(noPositions).toBeInTheDocument();
  });
};

export const validateNewPoolMessage = async () => {
  // start point: add liquidity
  await waitFor(async () => {
    const newPoolMessage = await screen.findByText(
      /You are creating a new pool/
    );
    expect(newPoolMessage).toBeInTheDocument();
  });
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
  await waitFor(async () => {
    const submitBtn = await screen.findByText(/Enter Ether amount/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
};

export const validateButtonInformToAmount = async () => {
  // start point: add liquidity
  const coinFromInput = screen.getByLabelText(/Coin From Input/);
  await fireEvent.change(coinFromInput, {
    target: {
      value: "10",
    },
  });
  await waitFor(async () => {
    const submitBtn = await screen.findByText(/Enter DAI amount/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
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
  await waitFor(async () => {
    const submitBtn = await screen.findByText(/Insufficient Ether balance/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
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
  await waitFor(async () => {
    const submitBtn = await screen.findByText(/Insufficient DAI balance/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
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
  await waitFor(async () => {
    const submitBtn = await screen.findByText(/Create liquidity/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
};

export const createLiquidity = async () => {
  // start point: add liquidity

  console.log("start create");
  const noPositions = await screen.queryByText(/You are creating a new pool/i);
  if (!noPositions) {
    console.log("liquidity already exists");
    expect(true);
    return;
  }

  console.log("no liquidity yet");

  const coinFromInput = screen.getByLabelText(/Coin From Input/);
  await fireEvent.change(coinFromInput, {
    target: {
      value: "1999",
    },
  });
  const coinToInput = screen.getByLabelText(/Coin To Input/);
  await fireEvent.change(coinToInput, {
    target: {
      value: "4000000",
    },
  });
  await waitFor(async () => {
    const submitBtn = await screen.findByText(/Create liquidity/);
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  const submitBtn = await screen.findByText(/Create liquidity/);
  fireEvent.click(submitBtn);

  await waitFor(async () => {
    const successFeedback = await screen.findByText(/New pool created/);
    expect(successFeedback).toBeInTheDocument();
  });
};
