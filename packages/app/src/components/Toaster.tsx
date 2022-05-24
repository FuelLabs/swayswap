import toast, { ToastBar, Toaster as Root } from "react-hot-toast";
import { MdClose } from "react-icons/md";

import { Button } from "./Button";

export function Toaster() {
  return (
    <Root position="bottom-right">
      {(t) => (
        <ToastBar
          toast={t}
          style={{ padding: 0, background: "transparent", ...t.style }}
        >
          {({ icon, message }) => (
            <div className="toast">
              {icon}
              {message}
              {t.type !== "loading" && (
                <Button
                  autoFocus
                  className="toast--close_btn"
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
