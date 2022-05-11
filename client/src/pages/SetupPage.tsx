import { useAppContext } from "src/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169]`,
};

export default function SetupPage() {
  const navigate = useNavigate();
  const { createWallet } = useAppContext();

  const createWalletMutation = useMutation(
    async () => {
      createWallet();
    },
    {
      onSuccess: () => {
        navigate("/assets");
      },
    }
  );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div
          onClick={() => createWalletMutation.mutate()}
          className={style.confirmButton}
        >
          Create wallet
        </div>
      </div>
    </div>
  );
}
