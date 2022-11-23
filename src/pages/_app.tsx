import '@stratego/polyfills'
import '@stratego/styles/_global.sass'
import { AppProps } from 'next/app'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Head from 'next/head'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { useCallback, useEffect, useState } from 'react'
import { Button, Col, Container, Offcanvas, Row } from 'react-bootstrap'
import { useCookies } from 'react-cookie'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { addDays } from 'date-fns'

enum CookieConsent {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

const StrategoLandingApp = ({
  Component,
  pageProps,
}: AppProps<WithoutProps>) => {
  const { t } = useTranslation('common')

  const [showCookiesDisclaimer, setCookiesDisclaimerVisibility] =
    useState(false)

  const [cookie, setCookie] = useCookies(['accept-cookies'])

  const handleCookiesAcceptance = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.isTrusted) {
        const expires = addDays(new Date(), 30)
        setCookie('accept-cookies', CookieConsent.ACCEPTED, {
          sameSite: 'strict',
          secure: true,
          // maxAge: getUnixTime(expires),
          expires,
        })
      }
    },
    [setCookie]
  )

  useEffect(() => {
    if (!cookie['accept-cookies']) {
      setCookiesDisclaimerVisibility(true)
    } else if (cookie['accept-cookies'] === CookieConsent.REJECTED) {
      setCookiesDisclaimerVisibility(true)
    } else if (cookie['accept-cookies'] === CookieConsent.ACCEPTED) {
      setCookiesDisclaimerVisibility(false)
    }
  }, [cookie])

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
    </SSRProvider>
  )
}

export default appWithTranslation(StrategoLandingApp)
