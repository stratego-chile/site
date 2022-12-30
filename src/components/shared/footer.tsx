import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Fragment } from 'react'
import Link from 'next/link'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { NextPage } from 'next'
import classNames from 'classnames'
import LanguageSelector from './language-selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import FooterStyles from '@stratego/styles/modules/Footer.module.sass'
import { contactData } from '@stratego/data/contact'

const Footer: NextPage<WithoutProps> = () => {
  const { t } = useTranslation(['common'])

  return (
    <Fragment>
      <div className={FooterStyles.wrapper}>
        <Container className="bg-transparent">
          <Row
            className={classNames(
              'd-flex justify-content-center justify-content-lg-between',
              'pt-5 py-lg-5 mb-2 mb-lg-5 gap-5'
            )}
          >
            <Col xs={12} lg="auto" className="order-2 order-lg-1">
              <Image
                fluid
                className="d-block mx-auto mb-5"
                style={{ height: '4rem' }}
                src={getAssetPath('logo-colored.svg')}
                alt={process.env.BRAND_NAME}
              />
              <address>
                {contactData.map(({ icon, text, linkPrefix }, key) => (
                  <Link
                    key={key}
                    href={`${linkPrefix}:${text.replace(/\ /gi, '')}`}
                    passHref
                    legacyBehavior
                  >
                    <a
                      className={classNames(
                        'd-flex align-items-center justify-content-center justify-content-lg-start',
                        'p-0 mb-4 gap-1',
                        'text-dark text-decoration-none'
                      )}
                    >
                      <FontAwesomeIcon icon={icon} fixedWidth height="1em" />
                      {text}
                    </a>
                  </Link>
                ))}
                <Link
                  className={classNames(
                    'd-grid align-items-center text-center text-lg-start',
                    'p-0 mb-4 gap-1',
                    'text-dark text-decoration-none'
                  )}
                  href="https://www.openstreetmap.org/way/579051556#map=19/-33.42477/-70.61791"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <p className="mb-0">Padre Mariano 272</p>
                  <p className="mb-0">Oficina 302</p>
                  <p className="mb-0">Providencia, Santiago, Chile</p>
                </Link>
              </address>
            </Col>
            <Col xs="auto" className="order-1 order-lg-2">
              <LanguageSelector theme="light-gray" />
            </Col>
          </Row>
        </Container>
        <Navbar variant="light" bg="transparent" expand>
          <Container className="d-grid d-lg-flex justify-content-center justify-content-lg-between px-lg-1">
            <Navbar.Text className="px-2 order-2 order-lg-1">
              {new Date().getFullYear()}
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

export default Footer
