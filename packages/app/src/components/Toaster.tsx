import toast, { ToastBar, Toaster as Root } from "react-hot-toast";
import { MdClose } from "react-icons/md";

import { Button } from "./Button";

const style = {
  toast: `px-4 py-3 flex items-center gap-2 bg-gray-800 text-gray-50 rounded-lg`,
  closeButton: `transition-all p-1 h-auto hover:opacity-100 focus-ring rounded border-transparent`,
};

export function Toaster() {
  return (
    <Root position="bottom-right">
      {(t) => (
        <ToastBar
          toast={t}
          style={{ padding: 0, background: "transparent", ...t.style }}
        >
          {({ icon, message }) => (
            <div className={style.toast}>
              {icon}
              {message}
              {t.type !== "loading" && (
                <Button
                  autoFocus
                  className={style.closeButton}
                  onPress={() => toast.dismiss(t.id)}
                >
                  <MdClose />
                </Button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Root>
  );
}
