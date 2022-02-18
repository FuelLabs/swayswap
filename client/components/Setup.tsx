import { useRouter } from 'next/router'
import { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const style = {
    wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
    content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
    formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
    transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl border border-[#20242A] 
    hover:border-[#41444F] flex justify-between`,
    transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
    currencySelector: `flex w-1/4`,
    currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
    hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
    currencySelectorIcon: `flex items-center`,
    currencySelectorTicker: `mx-2`,
    currencySelectorArrow: `text-lg`,
    confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169]`,
}

export const Setup = () => {
    const router = useRouter();
    const { getWallet, createWallet } = useContext(WalletContext);
    const wallet = getWallet();

    if (wallet) {
      router.push('/swap');
      return null;
    }

    const handleWalletCreation = () => {
      createWallet();
      router.push('/swap');
    }

    return (
      <div className={style.wrapper}>
        <div className={style.content}>
          <div onClick={handleWalletCreation} className={style.confirmButton}>Create wallet</div>
        </div>
      </div>
    );
}