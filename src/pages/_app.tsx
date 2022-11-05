import '@stratego/polyfills'
import '@stratego/styles/_global.sass'
import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { Fragment } from 'react'
import Head from 'next/head'

const StrategoLandingApp = ({ Component, pageProps }: AppProps) => (
  <Fragment>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Component {...pageProps} />
  </Fragment>
)

export default appWithTranslation(StrategoLandingApp)
