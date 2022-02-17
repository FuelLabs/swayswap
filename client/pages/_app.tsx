import '../styles/globals.css'
import { TransactionProvider } from '../context/TransactionContext'
import Header from '../components/Header'

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#282c34] text-white select-none flex flex-col justify-between`
}

function App({ Component, pageProps }: any) {
  return (
    <TransactionProvider>
      <div className={style.wrapper}>
      <Header {...pageProps} />
      <Component {...pageProps} />
      </div>
    </TransactionProvider>
  )
}

export default App
