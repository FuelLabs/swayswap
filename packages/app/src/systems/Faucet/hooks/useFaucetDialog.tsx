import { atom, useAtom } from "jotai";

import { useDialog } from "~/systems/UI";

const dialogAtom = atom(false);

export function useFaucetDialog() {
  const [opened, setOpened] = useAtom(dialogAtom);
  return useDialog({
    isOpen: opened,
    onOpenChange: setOpened,
  });
}
