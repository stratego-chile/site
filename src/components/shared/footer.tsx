import { Col, Container, Image, Nav, Navbar, Row } from 'react-bootstrap'
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

const Footer: NextPage<WithoutProps> = () => {
  const { t } = useTranslation(['common'])

  return (
    <Fragment>
      <div className="bg-primary shadow-lg">
        <Container>
          <Row
            className={classNames(
              'd-flex justify-content-center justify-content-lg-between',
              'pt-5 py-lg-5 mb-2 mb-lg-5 gap-5'
            )}
          >
            <Col
              xs={12}
              lg="auto"
              className="order-2 order-lg-1 text-center text-lg-start"
            >
              <Image
                fluid
                className="d-block mx-auto mb-2 mb-lg-4"
                style={{ height: '4rem' }}
                src={getAssetPath('logo-white.svg')}
                alt={t('common:baseTitle')}
              />
              <address className="text-light">
                <p>
                  {((email) => (
                    <a className="text-light" href={`mailto:${email}`}>
                      {email}
                    </a>
                  ))('contact@stratego.cl')}
                </p>
                Padre Mariano 272
                <br />
                Oficina 302
                <br />
                Providencia, Santiago, Chile
              </address>
            </Col>
            <Col xs="auto" className="order-1 order-lg-2">
              <LanguageSelector theme="light" />
            </Col>
          </Row>
        </Container>
        <Navbar variant="dark" bg="transparent" expand>
          <Container className="d-grid d-lg-flex justify-content-center justify-content-lg-between px-lg-1">
            <Nav>
              <Link href="/" passHref legacyBehavior>
                <Nav.Link as="a" className="mx-auto">
                  {new Date().getFullYear()} &reg; Stratego Technologies SpA
                </Nav.Link>
              </Link>
            </Nav>
            <Nav>
              <Link href="/privacy-policy" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t('sections:privacyPolicy.title'), 'simple')}
                </Nav.Link>
              </Link>
              <Link href="/legal" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t('sections:legal.title'), 'simple')}
                </Nav.Link>
              </Link>
              <Link href="/contact" passHref legacyBehavior>
                <Nav.Link as="a">
                  {capitalizeText(t('sections:contact.title'), 'simple')}
                </Nav.Link>
              </Link>
              <Nav.Link
                href="https://github.com/stratego-chile"
                target="_blank"
                rel="noreferrer noopener"
              >
                <FontAwesomeIcon icon={faGithub} />
              </Nav.Link>
              <Nav.Link
                href="https://github.com/stratego-chile/site"
                target="_blank"
                rel="noreferrer noopener"
                title={capitalizeText(t('common:seeSourceCode'), 'simple')}
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
