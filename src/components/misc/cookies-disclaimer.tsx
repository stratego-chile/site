import { CookieConsent, usableCookies } from '@stratego/helpers/cookies.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import addDays from 'date-fns/addDays'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Row from 'react-bootstrap/Row'
import { useCookies } from 'react-cookie'

const CookiesDisclaimer: React.FC<WithoutProps> = () => {
  const [consentCookie, setConsentCookie] = useCookies([usableCookies.consent])

  const { t } = useTranslation('common')

  const [showCookiesDisclaimer, setCookiesDisclaimerVisibility] =
    useState(false)

  const handleCookiesAcceptance = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.isTrusted) {
        const maxAge = addDays(new Date(), 30).getTime()
        setConsentCookie(usableCookies.consent, CookieConsent.ACCEPTED, {
          path: '/',
          sameSite: 'strict',
          secure: true,
          maxAge,
        })
      }
    },
    [setConsentCookie]
  )

  useEffect(() => {
    if (!consentCookie[usableCookies.consent]) {
      setCookiesDisclaimerVisibility(true)
    } else if (
      consentCookie[usableCookies.consent] === CookieConsent.REJECTED
    ) {
      setCookiesDisclaimerVisibility(true)
    } else if (
      consentCookie[usableCookies.consent] === CookieConsent.ACCEPTED
    ) {
      setCookiesDisclaimerVisibility(false)
    }
  }, [consentCookie])

  return (
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
          <Row className="justify-content-between">
            <Col
              xs="12"
              lg
              className="d-inline-flex text-lg-start align-items-center text-center"
            >
              <span className="fs-5">
                {capitalizeText(t`common:cookies.disclaimer.text`, 'simple')}
              </span>
            </Col>
            <Col
              xs="12"
              lg="auto"
              className="d-inline-flex justify-content-center gap-2 py-3"
            >
              <Button className="text-light" onClick={handleCookiesAcceptance}>
                {capitalizeText(
                  t`common:cookies.disclaimer.buttons.accept`,
                  'simple'
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

CookiesDisclaimer.propTypes = {}

CookiesDisclaimer.displayName = 'CookiesDisclaimer'

export default CookiesDisclaimer
