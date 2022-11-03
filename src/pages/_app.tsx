import '@stratego/styles/_libs.sass'
import '@stratego/styles/_global.sass'
import { AppProps } from 'next/app'

const StrategoLanding = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default StrategoLanding
