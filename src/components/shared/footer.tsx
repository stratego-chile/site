import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { contactData, locationData } from '@stratego/data/contact'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import FooterStyles from '@stratego/styles/modules/Footer.module.sass'
import Emoji from 'a11y-react-emoji'
import classNames from 'classnames'
import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'

const LanguageSelector = dynamic(
  () => import('@stratego/components/shared/language-selector')
)

const Footer: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const { t } = useTranslation(['common'])

  return (
    <Fragment>
      <div className={FooterStyles.wrapper}>
        <Container className="bg-transparent">
          <Row
            className={classNames(
              'd-flex justify-content-center justify-content-lg-between',
              'gap-5'
            )}
          >
            <Col xs={12} lg="auto" className="order-lg-1 order-2">
              <Image
                fluid
                className="d-block mx-auto mb-5"
                style={{ height: '4rem' }}
                src={getAssetPath('logo-white.svg')}
                alt={process.env.BRAND_NAME}
              />

              <address>
                <div className="d-flex flex-column text-lg-start text-center">
                  {contactData.map(({ icon, text, linkPrefix, link }, key) => (
                    <Link
                      key={key}
                      href={
                        linkPrefix
                          ? typeof text === 'string'
                            ? `${linkPrefix}:${text.replace(/\ /gi, '')}`
                            : link
                              ? `${linkPrefix}:${link}`
                              : router.asPath
                          : (link ?? router.asPath)
                      }
                      className="d-grid text-decoration-none mb-3"
                      style={{ color: 'inherit' }}
                      target={link ? '_blank' : undefined}
                      rel={link ? 'noreferrer noopener' : undefined}
                    >
                      <p
                        className={classNames(
                          'd-inline-flex align-items-start',
                          'justify-content-center justify-content-lg-start',
                          'mb-0 gap-1'
                        )}
                      >
                        <FontAwesomeIcon
                          className={classNames(
                            text instanceof Array && 'd-none d-lg-inline-flex'
                          )}
                          icon={icon}
                          fixedWidth
                          height="1em"
                        />

                        {text instanceof Array
                          ? text.map((fragment, fragmentKey) => (
                              <Fragment key={fragmentKey}>
                                {fragment}
                                <br />
                              </Fragment>
                            ))
                          : text}
                      </p>
                    </Link>
                  ))}
                </div>
              </address>
            </Col>

            <Col
              xs={12}
              lg="auto"
              className={classNames(
                'd-flex flex-column flex-lg-row order-lg-2 order-3 gap-5'
              )}
            >
              {locationData.map(({ icon, text, link }, key) => (
                <Link
                  key={key}
                  href={link ?? router.asPath}
                  className="d-grid text-decoration-none"
                  style={{ color: 'inherit' }}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span
                    className={classNames(
                      'd-inline-flex align-items-start',
                      'justify-content-center justify-content-lg-start',
                      'mb-0 gap-3'
                    )}
                  >
                    <Emoji symbol={icon} className="fs-3" />

                    {text.map((fragment, fragmentKey) => (
                      <Fragment key={fragmentKey}>
                        {fragment}
                        <br />
                      </Fragment>
                    ))}
                  </span>
                </Link>
              ))}
            </Col>

            <Col xs="auto" className="order-lg-3 order-1">
              <LanguageSelector theme="light" />
            </Col>
          </Row>
        </Container>

        <Container className="bg-transparent">
          <Row className="d-flex justify-content-center">
            <Col xs="auto" className="py-5">
              <Image
                fluid
                src="/images/certificates/ISO-IEC_27001_2022.webp"
                width="540"
                height="347"
                alt="ISO/IEC 27001:2022 Certificated"
              />
            </Col>
          </Row>
        </Container>

        <Navbar variant="dark" bg="transparent" expand>
          <Container className="d-grid d-lg-flex justify-content-center justify-content-lg-between px-lg-1">
            <Navbar.Text className="order-lg-1 text-xl-start order-2 px-2 text-center">
              2022 - {new Date().getFullYear()}
              <br className="d-inline d-xl-none my-3" />
              {String.fromCharCode(174).surround(' ')}
              {process.env.BRAND_JURIDICAL_NAME}
            </Navbar.Text>

            <Nav className="d-block d-lg-flex order-lg-2 order-1 text-center">
              {/* TODO: uncomment this section when ready */}
              {/* <Link href="/about/privacy-policy" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:privacyPolicy.title`, 'simple')}
                </Nav.Link>
              </Link>

              <Link href="/about/cookies" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:cookies.title`, 'simple')}
                </Nav.Link>
              </Link>

              <Link href="/about/legal" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:legal.title`, 'simple')}
                </Nav.Link>
              </Link> */}

              <Link href="/contact" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:contact.title`, 'simple')}
                </Nav.Link>
              </Link>

              <Link
                href="https://github.com/stratego-chile"
                passHref
                legacyBehavior
              >
                <Nav.Link
                  className="d-inline-flex d-lg-block"
                  target="_blank"
                  rel="noreferrer noopener"
                  active={false}
                >
                  <FontAwesomeIcon icon={faGithub} fixedWidth />
                </Nav.Link>
              </Link>

              <Link
                href="https://github.com/stratego-chile/site"
                passHref
                legacyBehavior
              >
                <Nav.Link
                  className="d-inline-flex d-lg-block"
                  target="_blank"
                  rel="noreferrer noopener"
                  active={false}
                  title={capitalizeText(t`common:seeSourceCode`, 'simple')}
                >
                  <FontAwesomeIcon icon={faCode} fixedWidth />
                </Nav.Link>
              </Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
    </Fragment>
  )
}

Footer.displayName = 'Footer'

export default Footer
