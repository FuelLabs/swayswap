/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionStatus, type TransactionResult } from "fuels";
import toast from "react-hot-toast";

import { BLOCK_EXPLORER_URL } from "~/config";
import { Link } from "~/systems/UI";
import type { Maybe } from "~/types";

export function getBlockExplorerLink(path: string) {
  return `${BLOCK_EXPLORER_URL}${path}?providerUrl=${encodeURIComponent(
    process.env.VITE_FUEL_PROVIDER_URL as string
  )}`;
}

type TxLinkProps = {
  id?: string;
};

export function TxLink({ id }: TxLinkProps) {
  return (
    <p className="text-xs text-gray-300 mt-1">
      <Link isExternal href={getBlockExplorerLink(`/transaction/${id}`)}>
        View it on Fuel Explorer
      </Link>
    </p>
  );
}

export function txFeedback(
  txMsg: string,
  onSuccess?: (data: TransactionResult<any>) => void | Promise<void>
) {
  return async (data: Maybe<TransactionResult<any>>) => {
    const txLink = <TxLink id={data?.id} />; // TODO: is this correct?

    /**
     * Show a toast success message if status.type === 'success'
     */
    if (data?.status === TransactionStatus.success) {
      await onSuccess?.(data);
      toast.success(
        <>
          {" "}
          {txMsg} {txLink}{" "}
        </>,
        { duration: 8000 }
      );
      return;
    }

    /**
     * Show a toast error if status.type !== 'success''
     */
    toast.error(<>Transaction reverted! {txLink}</>);
  };
}
