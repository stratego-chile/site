import {
  type FC,
  useEffect,
  useState,
  type PropsWithChildren,
  type DetailedHTMLProps,
  type HTMLAttributes,
  useMemo,
  useRef,
  useCallback,
} from 'react'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import {
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_TITLE,
} from '@stratego/helpers/defaults.helper'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import NavBar from '@stratego/components/shared/navbar'
import Footer from '@stratego/components/shared/footer'
import { getPageTitle } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import Head from 'next/head'
import { useWindowScroll } from 'react-use'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import addDays from 'date-fns/addDays'
import { CookieConsent, usableCookies } from '@stratego/helpers/cookies.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { useTranslation } from 'next-i18next'
import { useCookies } from 'react-cookie'
import { type LinkSpec } from '@stratego/data/navigation-links'

export type LayoutProps = {
  pageTitle?: string
  pageDescription?: string
  brandDepartment?: string
  subLinks?: Array<LinkSpec>
  defaultGrid?: boolean
  showNavigationOptions?: boolean
  showReturnToTopButton?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  pageTitle,
  pageDescription,
  brandDepartment,
  subLinks = [],
  defaultGrid,
  showNavigationOptions = false,
  showReturnToTopButton: $showReturnToTopButton = true,
  children,
  ...divProps
}) => {
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()

  const [consentCookie, setConsentCookie] = useCookies([usableCookies.consent])

  const { t } = useTranslation('common')

  const [showCookiesDisclaimer, setCookiesDisclaimerVisibility] =
    useState(false)

  const { y: scrollPosition } = useWindowScroll()

  const showReturnToTopButtonRef = useRef<HTMLDivElement>(null)

  const showReturnToTopButton = useMemo(
    () =>
      typeof window !== 'undefined' &&
      $showReturnToTopButton &&
      scrollPosition > window.outerHeight * 0.6,
    [scrollPosition, $showReturnToTopButton]
  )

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

  useEffect(() => {
    setTitle(pageTitle ? getPageTitle(pageTitle) : DEFAULT_TITLE)
  }, [pageTitle])

  useEffect(() => {
    setDescription(pageDescription ? pageDescription : DEFAULT_PAGE_DESCRIPTION)
  }, [pageDescription])

  return (
    <div className={classNames(LayoutStyles.pageContainer)}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <NavBar
        showNavigationOptions={showNavigationOptions}
        theme="light"
        brandDepartment={brandDepartment}
        subLinks={subLinks}
      />
      <div
        {...divProps}
        className={classNames(
          LayoutStyles.pageContent,
          divProps.className,
          defaultGrid && 'py-5'
        )}
      >
        {defaultGrid ? (
          <Container>
            <Row>
              <Col>{children}</Col>
            </Row>
          </Container>
        ) : (
          children
        )}
      </div>
      <motion.div
        ref={showReturnToTopButtonRef}
        animate={{ opacity: showReturnToTopButton ? 1 : 0 }}
        className={LayoutStyles.topTopButton}
      >
        <Button
          className="text-light rounded-pill"
          onClick={() =>
            document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </Button>
      </motion.div>
      <Footer />
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
                className="d-inline-flex text-center text-lg-start align-items-center"
              >
                <span className="fs-5">
                  {capitalizeText(t`common:cookies.disclaimer.text`, 'simple')}
                </span>
              </Col>
              <Col
                xs="12"
                lg="auto"
                className="d-inline-flex gap-2 py-3 justify-content-center"
              >
                <Button
                  className="text-light"
                  onClick={handleCookiesAcceptance}
                >
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
    </div>
  )
}

export default Layout
