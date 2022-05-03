import { useAppContext } from "src/context/AppContext";
import { useNavigate } from "react-router-dom";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169]`,
};

export default function SetupPage() {
  const navigate = useNavigate();
  const { createWallet } = useAppContext();

  const handleWalletCreation = () => {
    createWallet();
    navigate("/assets");
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div onClick={handleWalletCreation} className={style.confirmButton}>
          Create wallet
        </div>
      </div>
    </div>
  );
}
