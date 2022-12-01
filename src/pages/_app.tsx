import '@stratego/polyfills'
import '@stratego/styles/_global.sass'
import { type AppProps } from 'next/app'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Head from 'next/head'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Container, Offcanvas, Row } from 'react-bootstrap'
import { Cookies, CookiesProvider, useCookies } from 'react-cookie'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { addDays } from 'date-fns'
import { CookieConsent, usableCookies } from '@stratego/helpers/cookies.helper'

const StrategoLandingApp = ({
  Component,
  pageProps,
  cookies,
}: AppProps & {
  cookies?: string | object | null
}) => {
  const { t } = useTranslation('common')

  const [showCookiesDisclaimer, setCookiesDisclaimerVisibility] =
    useState(false)

  const [cookie, setCookie] = useCookies([usableCookies.consent])

  const isBrowser = typeof window !== 'undefined'

  const handleCookiesAcceptance = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.isTrusted) {
        const maxAge = addDays(new Date(), 30).getTime()
        setCookie(usableCookies.consent, CookieConsent.ACCEPTED, {
          domain: location.hostname,
          path: '/',
          sameSite: 'strict',
          secure: true,
          maxAge,
        })
      }
    },
    [setCookie]
  )

  useEffect(() => {
    if (!cookie[usableCookies.consent]) {
      setCookiesDisclaimerVisibility(true)
    } else if (cookie[usableCookies.consent] === CookieConsent.REJECTED) {
      setCookiesDisclaimerVisibility(true)
    } else if (cookie[usableCookies.consent] === CookieConsent.ACCEPTED) {
      setCookiesDisclaimerVisibility(false)
    }
  }, [cookie])

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
          <Offcanvas
            show={showCookiesDisclaimer}
            backdrop="static"
            placement="bottom"
            autoFocus
            enforceFocus
            restoreFocus
            renderStaticNode
            onHide={() => setCookiesDisclaimerVisibility(false)}
          >
            <Offcanvas.Body>
              <Container>
                <Row className="justify-content-between gap-3">
                  <Col
                    xs="12"
                    lg="auto"
                    className="d-inline-flex text-center text-lg-start align-items-center"
                  >
                    <span className="fs-5">
                      {capitalizeText(
                        t('common:cookies.disclaimer.text'),
                        'simple'
                      )}
                    </span>
                  </Col>
                  <Col xs="12" lg="auto" className="d-inline-flex gap-2">
                    <Button
                      className="text-light"
                      onClick={handleCookiesAcceptance}
                    >
                      {capitalizeText(
                        t('common:cookies.disclaimer.buttons.accept'),
                        'simple'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Offcanvas.Body>
          </Offcanvas>
        </GoogleReCaptchaProvider>
      </CookiesProvider>
    </SSRProvider>
  )
}

export default appWithTranslation(StrategoLandingApp)
