import '../styles/globals.css'
import { WalletProvider } from '../context/WalletContext'
import Header from '../components/Header'

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#282c34] text-white select-none flex flex-col justify-between`
}

function App({ Component, pageProps }: any) {
  return (
    <WalletProvider>
      <div className={style.wrapper}>
      <Header {...pageProps} />
      <Component {...pageProps} />
      </div>
    </WalletProvider>
  )
}

export default App
