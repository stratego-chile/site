import {
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Image,
  InputGroup,
  Nav,
  Navbar,
  Row
} from 'react-bootstrap'
import { Fragment, useCallback } from 'react'
import Link from 'next/link'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { useTranslation, i18n } from 'next-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { getLanguage } from 'language-flag-colors'
import { useLocale } from '@stratego/hooks/useLocale'
import { useRouter } from 'next/router'
import availableLocales from '@stratego/locale.middleware'
import { capitalizeText } from '@stratego/helpers/text.helper'

const Footer: RootComponent = () => {
  const { t } = useTranslation(['common'])

  const router = useRouter()

  const { pathname, query, asPath } = router

  const { currentLocale, changeLocale } = useLocale()

  const handleLanguageSelection = useCallback(
    (event: React.MouseEvent<HTMLElement>, lang: string) => {
      if (event.isTrusted) {
        if (lang !== currentLocale && i18n) changeLocale(lang).then(() => {
          router.push({ pathname, query }, asPath, { locale: lang });
        })
      }
    },
  [currentLocale, changeLocale, router, pathname, query, asPath])

  const getLanguageReferenceContent = (options?: {
    lang: string
    mode?: 'label' | 'selector'
  }) => (
    (($lang) => (
      <Fragment>
        <span>{$lang.flag.emoji}</span>
        {options?.mode === 'selector' && <span>{$lang.nativeName}</span>}
      </Fragment>
    ))(getLanguage(options?.lang ?? currentLocale)!)
  )

  return (
    <Fragment>
      <div className="border-top">
        <Container>
          <Row className="justify-content-center justify-content-lg-between py-5 px-2 mb-2 mb-lg-5 gap-5">
            <Col xs={12} lg="auto">
              <Image
                fluid
                className="d-block mx-auto"
                style={{ height: '4rem' }}
                src={getAssetPath('logo-colored.svg')}
                alt={t('common:baseTitle')}
              />
            </Col>
            <Col xs="auto">
              <InputGroup className="border rounded">
                <InputGroup.Text
                  className="bg-light border-0 gap-2"
                  title={getLanguage(currentLocale)?.nativeName}
                >
                  {getLanguageReferenceContent()}
                </InputGroup.Text>
                <DropdownButton
                  variant="light"
                  title={<FontAwesomeIcon icon={faGlobe} />}
                  drop="up"
                  align="end"
                >
                  {availableLocales().map((lang, key) => (
                    <Dropdown.Item
                      key={key}
                      href="#"
                      className="d-flex justify-content-between gap-3"
                      onClick={(event) => handleLanguageSelection(event, lang)}
                    >
                      {getLanguageReferenceContent({ lang, mode: 'selector'})}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </InputGroup>
            </Col>
          </Row>
        </Container>
        <Navbar variant="light" bg="gray" expand>
          <Container className="d-grid d-lg-flex justify-content-center justify-content-lg-between">
            <Nav>
              <Link href="/" passHref legacyBehavior>
                <Nav.Link as="a" className="mx-auto">
                  {new Date().getFullYear()} &reg; Stratego SpA
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
            </Nav>
          </Container>
        </Navbar>
      </div>
    </Fragment>
  )
}

export default Footer
