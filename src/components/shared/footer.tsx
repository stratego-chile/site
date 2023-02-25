import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { contactData } from '@stratego/data/contact'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import FooterStyles from '@stratego/styles/modules/Footer.module.sass'
import classNames from 'classnames'
import { NextPage } from 'next'
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
              'py-lg-5 mb-lg-5 mb-2 gap-5 pt-5'
            )}
          >
            <Col xs={12} lg="auto" className="order-2 order-lg-1">
              <Image
                fluid
                className="d-block mx-auto mb-5"
                style={{ height: '4rem' }}
                src={getAssetPath('logo-white.svg')}
                alt={process.env.BRAND_NAME}
              />
              <address>
                <div className="d-flex flex-column text-center text-lg-start">
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
                          : link ?? router.asPath
                      }
                      className="d-grid mb-3 text-decoration-none"
                      style={{ color: 'inherit' }}
                      target={link ? '_blank' : undefined}
                      rel={link ? 'noreferrer noopener' : undefined}
                    >
                      <p
                        className={classNames(
                          'd-inline-flex align-items-center',
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
            <Col xs="auto" className="order-1 order-lg-2">
              <LanguageSelector theme="light" />
            </Col>
          </Row>
        </Container>
        <Navbar variant="dark" bg="transparent" expand>
          <Container className="d-grid d-lg-flex justify-content-center justify-content-lg-between px-lg-1">
            <Navbar.Text className="px-2 order-2 order-lg-1">
              2022 - {new Date().getFullYear()}
              {String.fromCharCode(174).surround(' ')}
              {process.env.BRAND_JURIDICAL_NAME}
            </Navbar.Text>
            <Nav className="d-block d-lg-flex text-center order-1 order-lg-2">
              <Link href="/privacy-policy" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:privacyPolicy.title`, 'simple')}
                </Nav.Link>
              </Link>
              <Link href="/cookies" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:cookies.title`, 'simple')}
                </Nav.Link>
              </Link>
              <Link href="/legal" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:legal.title`, 'simple')}
                </Nav.Link>
              </Link>
              <Link href="/contact" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t`sections:contact.title`, 'simple')}
                </Nav.Link>
              </Link>
              <Nav.Link
                className="d-inline-flex d-lg-block"
                href="https://github.com/stratego-chile"
                target="_blank"
                rel="noreferrer noopener"
              >
                <FontAwesomeIcon icon={faGithub} />
              </Nav.Link>
              <Nav.Link
                className="d-inline-flex d-lg-block"
                href="https://github.com/stratego-chile/site"
                target="_blank"
                rel="noreferrer noopener"
                title={capitalizeText(t`common:seeSourceCode`, 'simple')}
              >
                <FontAwesomeIcon icon={faCode} />
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
    </Fragment>
  )
}

Footer.propTypes = {}

Footer.displayName = 'Footer'

export default Footer
