import '@stratego/polyfills'
import '@stratego/styles/_global.sass'
import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Head from 'next/head'
import SSRProvider from 'react-bootstrap/SSRProvider'

const StrategoLandingApp = ({ Component, pageProps }: AppProps<WithoutProps>) => {
  return (
    <SSRProvider>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.CAPTCHA_KEY}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: 'body',
        }}
      >
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </GoogleReCaptchaProvider>
    </SSRProvider>
  )
}

export default appWithTranslation(StrategoLandingApp)
