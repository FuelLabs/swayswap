/* eslint-disable import/no-extraneous-dependencies */
import { screen, waitFor } from "@fuels-ui/test-utils";
import { parseUnits } from "ethers/lib/utils";
import type { Wallet } from "fuels";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { objectId } from "./utils";

import Providers from "~/components/Providers";
import { DECIMAL_UNITS, TOKEN_ID } from "~/config";
import { faucet } from "~/context/AppContext";
import { Token_contractAbi__factory } from "~/types/contracts";

export function getLocationDisplay() {
  return new Promise<ReturnType<typeof screen.findByTestId>>(
    // eslint-disable-next-line no-async-promise-executor
    async (resolve) => {
      await waitFor(async () => {
        resolve(screen.findByTestId("location-display"));
      });
    }
  );
}

export function HookProvider({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <Providers>{children}</Providers>
    </MemoryRouter>
  );
}

export async function mint(
  wallet: Wallet,
  faucetAmount: string,
  mintAmount: string
) {
  await faucet(parseUnits(faucetAmount, DECIMAL_UNITS).toBigInt(), wallet);
  const amount = parseUnits(mintAmount, DECIMAL_UNITS).toBigInt();
  const contract = Token_contractAbi__factory.connect(TOKEN_ID, wallet);
  await contract.functions.mint_coins(amount);
  await contract.functions.transfer_coins_to_output(
    amount,
    objectId(contract.id),
    objectId(wallet.address),
    { variableOutputs: 1 }
  );
}
