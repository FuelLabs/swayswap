import toast, { ToastBar, Toaster as Root } from "react-hot-toast";
import { MdClose } from "react-icons/md";

const style = {
  toast: `px-4 py-3 flex items-center gap-2 bg-[#212327] text-gray-50 rounded-lg border-2 border-[#333943]`,
  closeButton: `transition-all opacity-50 hover:opacity-100`,
};

export function Toaster() {
  return (
    <Root position="bottom-right">
      {(t) => (
        <ToastBar toast={t} style={{ padding: 0, background: "transparent" }}>
          {({ icon, message }) => (
            <div className={style.toast}>
              {icon}
              {message}
              {t.type !== "loading" && (
                <button
                  className={style.closeButton}
                  onClick={() => toast.dismiss(t.id)}
                >
                  <MdClose />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Root>
  );
}
