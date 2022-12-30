import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { Fragment, useMemo, type FC } from 'react'
import {
  Navbar,
  Container,
  Image,
  Nav,
  NavDropdown,
  Button,
} from 'react-bootstrap'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'
import LanguageSelector from './language-selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import NavbarStyles from '@stratego/styles/modules/Navbar.module.sass'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export type NavLinkSpec<NavLinkType = 'link' | 'menu'> = {
  text: string
} & (NavLinkType extends 'link'
  ? { href: string; type: 'link' }
  : { type: 'menu'; subLinks: Array<NavLinkSpec<'link'>> })

type NavBarProps = {
  showNavigationOptions?: boolean
  theme?: string
  brandDepartment?: string
  subLinks?: Array<NavLinkSpec>
}

const NavBar: FC<NavBarProps> = ({
  showNavigationOptions,
  theme = 'dark-blue',
  brandDepartment,
  subLinks = [],
}) => {
  const { t } = useTranslation(['common', 'sections'])

  const links: Array<NavLinkSpec> = useMemo(
    () => [
      {
        text: t`sections:home.title`,
        href: '/home',
        type: 'link',
      },
      {
        text: t`sections:services.title`,
        type: 'menu',
        subLinks: [
          {
            href: '/security/services',
            text: t`sections:security.title`,
            type: 'link',
          },
        ],
      },
      {
        text: t`common:aboutUs`,
        href: '/about-us',
        type: 'link',
      },
    ],
    [t]
  )

  const renderNavLinks = ($links: Array<NavLinkSpec>) => (
    <Fragment>
      {$links.map((link, key) =>
        link.type === 'menu' ? (
          <NavDropdown
            key={key}
            title={capitalizeText(link.text.toLowerCase(), 'simple')}
            align="end"
            renderMenuOnMount
          >
            {link.subLinks.map((subLink, subLinkKey) => (
              <Link
                href={subLink.href}
                passHref
                legacyBehavior
                key={subLinkKey}
              >
                <NavDropdown.Item>
                  {capitalizeText(subLink.text.toLowerCase(), 'simple')}
                </NavDropdown.Item>
              </Link>
            ))}
          </NavDropdown>
        ) : (
          <Link key={key} href={link.href} passHref legacyBehavior>
            <Nav.Link as="a">
              {capitalizeText(link.text.toLowerCase(), 'simple')}
            </Nav.Link>
          </Link>
        )
      )}
    </Fragment>
  )

  return (
    <Fragment>
      <Navbar
        variant="light"
        bg={theme}
        expand="lg"
        className="position-static"
        style={{ zIndex: 1050 }}
      >
        <Container className="px-lg-1">
          <Link href="/home" legacyBehavior passHref>
            <Navbar.Brand className="d-flex fw-bold py-3 px-2 gap-3">
              <Image
                className={classNames('d-block', NavbarStyles.brandImage)}
                src={getAssetPath('logo-colored-simple.svg')}
                alt={process.env.BRAND_NAME}
                fluid
              />
              {brandDepartment && (
                <span
                  className={classNames(
                    'fw-normal border-lg-start ps-lg-3 text-wrap',
                    NavbarStyles.brandDepartment
                  )}
                >
                  {capitalizeText(brandDepartment, 'simple')}
                </span>
              )}
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle className="border-0">
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          {showNavigationOptions && (
            <Navbar.Collapse>
              <Nav className="ms-auto px-2 px-lg-0 pb-4 pb-lg-0 gap-4 row-gap-2 fw-semibold text-center">
                {renderNavLinks(links)}
                <Nav.Item className="d-inline-flex align-items-center mx-auto">
                  <Link href="/contact" passHref legacyBehavior>
                    <Button
                      variant="primary"
                      className="rounded-pill fw-semibold text-light px-4"
                    >
                      {capitalizeText(t`common:contactUs`, 'simple')}
                    </Button>
                  </Link>
                </Nav.Item>
                <Nav.Item className="d-inline-flex align-items-center mx-auto">
                  <LanguageSelector theme="transparent" className="text-dark" />
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
      {subLinks.hasItems() && (
        <Navbar
          variant="light"
          className={classNames('shadow', NavbarStyles.subLinksNavbar)}
          sticky="top"
        >
          <Container className="px-lg-1 fw-semibold">
            <Nav className="gap-4 row-gap-2">{renderNavLinks(subLinks)}</Nav>
          </Container>
        </Navbar>
      )}
    </Fragment>
  )
}

export default NavBar
