import type { TransactionResult } from "fuels";
import toast from "react-hot-toast";

import { BLOCK_EXPLORER_URL } from "~/config";
import { Link } from "~/systems/UI";

export function getBlockExplorerLink(path: string) {
  return `${BLOCK_EXPLORER_URL}${path}?providerUrl=${encodeURIComponent(
    process.env.VITE_FUEL_PROVIDER_URL as string
  )}`;
}

export function txFeedback(
  txMsg: string,
  onSuccess: () => void | Promise<void>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (data: TransactionResult<any> | undefined) => {
    const txLink = (
      <p className="text-xs text-gray-300 mt-1">
        <Link
          isExternal
          href={getBlockExplorerLink(`/transaction/${data?.transactionId}`)}
        >
          View it on Fuel Explorer
        </Link>
      </p>
    );

    /**
     * Show a toast success message if status.type === 'success'
     */
    if (data?.status.type === "success") {
      toast.success(
        <>
          {txMsg} {txLink}
        </>,
        { duration: 5000 }
      );
      await onSuccess();
      return;
    }

    /**
     * Show a toast error if status.type !== 'success''
     */
    toast.error(<>Transaction reverted! {txLink}</>);
  };
}
