import { useContext, Fragment, useState } from 'react'
import Image from 'next/image'
import { RiSettings3Fill } from 'react-icons/ri'
import { AiOutlineDown } from 'react-icons/ai'
import ethLogo from '../assets/eth.png'
import daiLogo from '../assets/dai.png'
import { Menu, Transition } from '@headlessui/react'

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
    menuWrapper: `px-1 py-1`,
    currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] 
    hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
    currencySelectorIcon: `flex items-center`,
    currencySelectorMenuItems: `absolute w-full mt-2 bg-[#2D2F36] divide-gray-100 
    rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`,
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
                    <Menu as="div" className="relative inline-block w-full">
                        <div>
                        <Menu.Button className={`${style.currencySelectorMenuButton}`}>
                            
                            <div className={style.currencySelectorIcon}>
                                            <Image src={ethLogo} alt="eth" height={20} width={20} />
                                        </div>
                                        ETH
                        </Menu.Button>
                        </div>
                        <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className={style.currencySelectorMenuItems}>
                                <div className={style.menuWrapper}>
                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-[#58c09b] text-white' : 'text-white'
                                        } ${style.currencySelectorItem}`}>
                                        <Image src={ethLogo} alt="eth" height={20} width={20} />
                                        ETH
                                    </button>
                                    )}
                                </Menu.Item>

                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-[#58c09b] text-white' : 'text-white'
                                        } ${style.currencySelectorItem}`}>
                                        <Image src={daiLogo} alt="dai" height={20} width={20} />
                                        DAI
                                    </button>
                                    )}
                                </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
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