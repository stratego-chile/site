// Import global styles
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@stratego/styles/_global.sass'

// Import app modules
import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { showConsoleWarnings } from '@stratego/helpers/console.helper'
import '@stratego/polyfills'
import { Analytics } from '@vercel/analytics/react'
import { appWithTranslation } from 'next-i18next'
import { type AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect } from 'react'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { Cookies, CookiesProvider } from 'react-cookie'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

FontAwesomeConfig.autoAddCss = false // Prevent wrong icon size on SSR

const CookiesDisclaimer = dynamic(
  () => import('@stratego/components/misc/cookies-disclaimer')
)

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
          useRecaptchaNet
        >
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
          <CookiesDisclaimer />
        </GoogleReCaptchaProvider>
      </CookiesProvider>
      <Analytics />
    </SSRProvider>
  )
}

export default appWithTranslation(StrategoLandingApp)
