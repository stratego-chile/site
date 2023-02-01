import '@stratego/polyfills'
import '@stratego/styles/_global.sass'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { type AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Head from 'next/head'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { type FC, useEffect, type PropsWithChildren, useId } from 'react'
import { Cookies, CookiesProvider } from 'react-cookie'
import { showConsoleWarnings } from '@stratego/helpers/console.helper'
import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { Analytics } from '@vercel/analytics/react'
import {
  PusherProvider as $PusherProvider,
  type PusherProviderProps,
} from '@harelpls/use-pusher'
import { useAsyncMemo } from '@stratego/hooks/useAsyncMemo'

FontAwesomeConfig.autoAddCss = false // Prevent wrong icon size on SSR

const PusherProvider = $PusherProvider as FC<
  PropsWithChildren<PusherProviderProps>
>

const StrategoLandingApp = ({
  Component,
  pageProps,
  cookies,
}: AppProps & {
  cookies?: string | object | null
}) => {
  const isBrowser = typeof window !== 'undefined'

  const userId = useId()

  const { data: userToken } = useAsyncMemo(
    async () =>
      Buffer.from(
        new Uint8Array(
          await crypto.subtle.digest(
            'SHA-256',
            Uint8Array.from(Buffer.from(userId))
          )
        )
      ).toString('hex'),
    [userId]
  )

  useEffect(() => {
    showConsoleWarnings()
  }, [])

  return (
    <SSRProvider>
      <CookiesProvider cookies={isBrowser ? undefined : new Cookies(cookies)}>
        <PusherProvider
          clientKey={process.env.PUSHER_APP_KEY}
          cluster={process.env.PUSHER_APP_CLUSTER}
          triggerEndpoint="/api/pusher/trigger"
          auth={{
            headers: {
              Authorization: userToken,
            },
          }}
          forceTLS
        >
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
          </GoogleReCaptchaProvider>
        </PusherProvider>
      </CookiesProvider>
      <Analytics />
    </SSRProvider>
  )
}

export default appWithTranslation(StrategoLandingApp)
