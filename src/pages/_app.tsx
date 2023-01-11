import '@stratego/polyfills'
import '@stratego/styles/_global.sass'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { type AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Head from 'next/head'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { useEffect } from 'react'
import { Cookies, CookiesProvider } from 'react-cookie'
import { showConsoleWarnings } from '@stratego/helpers/console.helper'
import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'

FontAwesomeConfig.autoAddCss = false // Prevent icon wrong size on SSR

const StrategoLandingApp = ({
  Component,
  pageProps,
  cookies,
}: AppProps & {
  cookies?: string | object | null
}) => {
  const isBrowser = typeof window !== 'undefined'

  useEffect(() => {
    showConsoleWarnings()
  }, [])

  return (
    <SSRProvider>
      <CookiesProvider cookies={isBrowser ? undefined : new Cookies(cookies)}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.CAPTCHA_KEY}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: 'body',
          }}
        >
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
        </GoogleReCaptchaProvider>
      </CookiesProvider>
    </SSRProvider>
  )
}

export default appWithTranslation(StrategoLandingApp)
