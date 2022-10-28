import '@stratego/styles/_libs.sass'
import '@stratego/styles/_global.sass'
import type { AppProps } from 'next/app'

const StrategoApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default StrategoApp
