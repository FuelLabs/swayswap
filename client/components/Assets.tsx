import { useContext } from 'react'
import Image from 'next/image'
import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'
import { FaFaucet } from 'react-icons/fa';
import ethLogo from '../assets/eth.png'
import { useRouter } from 'next/router';

const coinsData = [
    {
        name: 'ETH',
        amount: '0.5',
        logo: ethLogo
    },
    {
        name: 'DAI',
        amount: '1000',
        logo: ethLogo
    }
]

const style = {
    wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
    content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
    formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
    transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-3xl border border-[#20242A] 
    flex justify-between`,
    transferPropInput: `bg-transparent flex items-center placeholder:text-[#B2B9D2] outline-none w-full text-2xl`,
    currencySelector: `flex w-1/4`,
    currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
    rounded-2xl text-xl font-medium p-2 mt-[-0.2rem]`,
    currencySelectorIcon: `flex items-center`,
    currencySelectorTicker: `mx-2`,
    faucetButton: `hover:bg-[#41444F] cursor-pointer p-1 rounded-xl`
}

const Swap = () => {
    const router = useRouter();
    // destructuring transaction context
    // const { formData, handleChange, sendTransaction } = useContext(TransactionContext)

    const handleSubmit = async (e: any) => {
        // const { addressTo, amount } = formData
        // e.preventDefault()

        // if (!addressTo || !amount) return

        // sendTransaction()
    }

    const handleClickFaucet = () => {
        console.log('faucet');
    }

  return (
    <div className={style.wrapper}>
        <div className={style.content}>
            <div className={style.formHeader}>
                <div>Assets</div>
                <div className={style.faucetButton} onClick={handleClickFaucet}>
                    <FaFaucet />
                </div>
            </div>

            {coinsData.map(coinData => (
                <div className={style.transferPropContainer}>
                    <div className={style.transferPropInput}>
                        <span>{coinData.amount}</span>
                    </div>

                    <div className={style.currencySelector}>
                        <div className={style.currencySelectorContent}>
                            <div className={style.currencySelectorIcon}>
                                <Image src={coinData.logo} alt={coinData.name} height={20} width={20} />
                            </div>
                            <div className={style.currencySelectorTicker}>{coinData.name}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Swap