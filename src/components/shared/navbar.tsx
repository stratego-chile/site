import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { Fragment, useId, useMemo, type FC } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import NavbarStyles from '@stratego/styles/modules/Navbar.module.sass'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import {
  cybersecurityLinks,
  type LinkSpec,
} from '@stratego/data/navigation-links'
import dynamic from 'next/dynamic'

const LanguageSelector = dynamic(
  () => import('@stratego/components/shared/language-selector')
)

type NavBarProps = {
  showNavigationOptions?: boolean
  theme?: string
  brandDepartment?: string
  subLinks?: Array<LinkSpec>
}

const NavBarLinks: FC<{
  links: Array<LinkSpec>
  mode?: 'root' | 'embed'
}> = ({ links = [], mode = 'root' }) => {
  const togglerId = useId()

  const { t } = useTranslation()

  return (
    <Fragment>
      {links.map((link, key) => (
        <Fragment key={key}>
          {link.subLinks ? (
            link.label ? (
              <Fragment>
                <Dropdown.Header
                  className={classNames(
                    'd-flex align-items-center py-1',
                    'fw-bold'
                  )}
                >
                  {capitalizeText(t(link.text).toLowerCase(), 'simple')}
                </Dropdown.Header>
                <NavBarLinks links={link.subLinks} mode="embed" />
                {links.reduce(
                  (counter, linkSpec) =>
                    !linkSpec.href && !linkSpec.subLinks ? ++counter : counter,
                  0
                ) > 1 && <Dropdown.Divider />}
              </Fragment>
            ) : (
              <Dropdown
                autoClose="outside"
                navbar
                align="start"
                drop={mode === 'embed' ? 'end' : undefined}
                className={classNames(mode === 'embed' && 'px-3 px-lg-2')}
              >
                <Dropdown.Toggle
                  as={Nav.Link}
                  id={togglerId}
                  className={classNames(mode === 'embed' && 'text-dark')}
                  style={{
                    fontWeight: mode === 'embed' ? 500 : 600,
                    fontSize: mode === 'embed' ? '0.85em' : 'inherit',
                  }}
                  disabled={!!link.disabled}
                >
                  {mode === 'root'
                    ? capitalizeText(t(link.text).toLowerCase(), 'simple')
                    : t(link.text)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {link.subLinks.map((subLink, subLinkKey) =>
                    subLink.href ? (
                      <Link
                        key={subLinkKey}
                        href={subLink.href}
                        passHref
                        legacyBehavior
                      >
                        <Dropdown.Item
                          style={{
                            fontSize: '0.85em',
                          }}
                          disabled={!!subLink.disabled}
                        >
                          {t(subLink.text)}
                        </Dropdown.Item>
                      </Link>
                    ) : (
                      <Fragment key={subLinkKey}>
                        <NavBarLinks links={[subLink]} mode="embed" />
                      </Fragment>
                    )
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )
          ) : link.href ? (
            <Link href={link.href} passHref legacyBehavior>
              <Nav.Link as="a" disabled={!!link.disabled}>
                {capitalizeText(t(link.text).toLowerCase(), 'simple')}
              </Nav.Link>
            </Link>
          ) : (
            <Navbar.Text>
              {capitalizeText(t(link.text).toLowerCase(), 'simple')}
            </Navbar.Text>
          )}
        </Fragment>
      ))}
    </Fragment>
  )
}

const NavBar: FC<NavBarProps> = ({
  showNavigationOptions,
  theme = 'dark-blue',
  brandDepartment,
  subLinks = [],
}) => {
  const { t } = useTranslation(['common', 'sections'])

  const links = useMemo<Array<LinkSpec>>(
    () => [
      {
        text: 'sections:home.title',
        href: '/home',
      },
      {
        text: 'common:aboutUs',
        href: '/about-us',
      },
      {
        text: 'sections:services.title',
        subLinks: [
          {
            text: 'sections:security.title',
            label: true,
            subLinks: cybersecurityLinks,
          },
        ],
      },
      {
        text: 'sections:utils.title',
        subLinks: [
          {
            text: 'sections:utils.list.0.title',
            href: '/utilities/password-generator',
          },
        ],
      },
      {
        text: 'sections:docs.title',
        href: '/docs',
      },
    ],
    []
  )

  return (
    <Fragment>
      <Navbar
        variant="dark"
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
                src={getAssetPath('logo-colored.svg')}
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
                <NavBarLinks links={links} />
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
                  <LanguageSelector
                    theme="transparent"
                    className="text-light"
                  />
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
            <Nav className="gap-4 row-gap-2">
              <NavBarLinks links={subLinks} />
            </Nav>
          </Container>
        </Navbar>
      )}
    </Fragment>
  )
}

export default NavBar
