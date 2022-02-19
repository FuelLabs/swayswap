import { useContext, Fragment, useState, useEffect } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'
import Image from 'next/image'
import ethLogo from "/public/assets/eth.png"

const style = {
    wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
    content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
    formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
    transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl border border-[#20242A] 
    hover:border-[#41444F] flex justify-between`,
    transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
    
    // coin selector
    currencySelector: `flex w-1/4`,
    currencySelectorMenuButton: `inline-flex justify-around w-full px-4 py-2 text-sm font-medium text-white 
    bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`,
    menuWrapper: ``,
    currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
    hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
    currencySelectorIcon: `flex items-center`,
    // currencySelectorMenuItems: `absolute w-full mt-2 bg-[#2D2F36] divide-gray-100 
    // rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`,
    currencySelectorItem: `flex justify-around rounded-md w-full px-2 py-2 text-sm`,
    
    confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169]`,
}



const Swap = () => {
    const handleSubmit = async (e: any) => {
        // const { addressTo, amount } = formData
        // e.preventDefault()

        // if (!addressTo || !amount) return

        // sendTransaction()
    }

    const assets = require('../lib/assets.json');

    const [currentlySelectedCoin, setCurrentlySelectedCoin] = useState("ETH");
    // const assets =[
    //     {
    //         "name": "ETH",
    //         "color": "CoinETH",
    //         "amount": 0,
    //         "img": "https://i.imgur.com/mC6aU4s.png"
    //     },
    //     {
    //         "name": "DAI",
    //         "color": "CoinDAI",
    //         "amount": 0,
    //         "img": "https://i.imgur.com/DRC4jp6.png"
    //     }
    // ]
    
    
  return (
    <div className={style.wrapper}>
        <div className={style.content}>
            <div className={style.formHeader}>
                <div>Swap</div>
                <div>
                    <RiSettings3Fill />
                </div>
            </div>

            <div className={style.transferPropContainer}>
                <input
                    type="text"
                    className={style.transferPropInput}
                    placeholder="0.0"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    // onChange={(e) => handleChange(e, 'amount')}
                />

                {/* coin selector */}
                <div className={style.currencySelector}>
                    <div className="relative inline-block w-full">
                        <div>
                        <select className={`${style.currencySelectorMenuButton}`} onChange={(e) => setCurrentlySelectedCoin(e.target.value)}>
                            <div className={style.currencySelectorIcon}>
                                <Image src={ethLogo} alt="eth" height={20} width={20} />
                            </div>
                            ETH
                            {assets.map(x =>(
                                <option value={x.name}>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-[#58c09b] text-white' : 'text-white'
                                        } ${style.currencySelectorItem}`}>
                                        <Image src={x.img} alt={x.name} height={20} width={20} />
                                    </button>
                                    )}
                                </option>
                            ))}
                        </select>  
                        </div>
                    </div>  
                </div>
            </div>

            <div className={style.transferPropContainer}>
                <input
                    type="text"
                    className={style.transferPropInput}
                    placeholder="0x..."
                    // onChange={(e) => handleChange(e, 'addressTo')}
                />
                <div className={style.currencySelector}></div>
            </div>
            
            <div onClick={(e) => handleSubmit(e)} className={style.confirmButton}>Confirm</div>
        </div>
    </div>
  )
}

export default Swap