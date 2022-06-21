import { atom, useAtom } from 'jotai';

const TWITTER_DIALOG_KEY = 'swayswap-share-twitter-dialog';
const openTwitterAtom = atom(localStorage.getItem(TWITTER_DIALOG_KEY) === 'true');

export function useTwitterDialog() {
  const [open, setOpen] = useAtom(openTwitterAtom);

  return {
    open: () => {
      const currentState = localStorage.getItem(TWITTER_DIALOG_KEY);
      if (currentState !== 'false') {
        setOpen(true);
        localStorage.setItem(TWITTER_DIALOG_KEY, String(true));
      }
    },
    close: () => {
      setOpen(false);
      localStorage.setItem(TWITTER_DIALOG_KEY, String(false));
    },
    isOpen: open,
  };
}
