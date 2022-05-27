import { atom, useAtom } from "jotai";
import { useEffect } from "react";

import FaucetPage from "./FaucetPage";

import { Dialog, useDialog } from "~/components/Dialog";

const faucetDialogAtom = atom(false);

export const useFaucetDialogAtom = () => useAtom(faucetDialogAtom);

export function FaucetDialog() {
  const dialog = useDialog();
  const [isOpen, setOpen] = useFaucetDialogAtom();

  useEffect(() => {
    dialog.setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog {...dialog.dialogProps}>
      <Dialog.Content onClose={() => setOpen(false)}>
        <FaucetPage />
      </Dialog.Content>
    </Dialog>
  );
}
