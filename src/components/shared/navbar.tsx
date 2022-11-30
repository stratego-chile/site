import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { Fragment, useEffect, useState, type FC } from 'react'
import { Navbar, Container, Image, Nav } from 'react-bootstrap'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'
import LanguageSelector from './language-selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import NavbarStyles from '@stratego/styles/modules/Navbar.module.sass'
import { contactData } from '@stratego/data/contact'
import { useMeasure } from 'react-use'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export type NavLinkSpec = {
  href: string
  text: string
}

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

  const [contactNavbarRef, contactNavbarMeasures] = useMeasure<HTMLDivElement>()
  const [mainNavbarRef, mainNavbarMeasures] = useMeasure<HTMLDivElement>()

  const [scrollY, setScrollY] = useState<number>(0)

  const links: Array<NavLinkSpec> = [
    {
      href: '/',
      text: t('sections:home.title'),
    },
    {
      href: '/security',
      text: t('sections:security.title'),
    },
  ]

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Fragment>
      <Navbar
        ref={contactNavbarRef}
        variant="dark"
        className={classNames(
          'py-0 border border-0 border-bottom',
          'border-deep-dark-blue',
          NavbarStyles.contactNavbar,
          subLinks.hasItems() && 'd-none',
          scrollY > contactNavbarMeasures.height + mainNavbarMeasures.height &&
            !subLinks.hasItems() &&
            NavbarStyles.contactNavBarScrolled
        )}
        sticky={!subLinks.hasItems() ? 'top' : undefined}
      >
        <Container className="justify-content-center justify-content-lg-end px-0">
          <Nav className="gap-4 text-center">
            {contactData.map(({ icon, text, linkPrefix }, key) => (
              <Nav.Item key={key} className="p-1">
                <Nav.Link
                  className="p-0"
                  href={`${linkPrefix}:${text.replace(/\ /gi, '')}`}
                >
                  <FontAwesomeIcon icon={icon} />
                  &ensp;{text}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Container>
      </Navbar>
      <Navbar ref={mainNavbarRef} variant="dark" bg={theme} expand="lg">
        <Container className="px-lg-1">
          <Navbar.Brand className="d-flex fw-bold py-3 px-2 gap-3">
            <Image
              className={classNames('d-block', NavbarStyles.brandImage)}
              src={getAssetPath('logo-white.svg')}
              alt={process.env.BRAND_NAME}
              fluid
            />
            {brandDepartment && (
              <span
                className={classNames(
                  'fw-light border-lg-start ps-lg-3 text-wrap',
                  NavbarStyles.brandDepartment
                )}
              >
                {capitalizeText(brandDepartment, 'simple')}
              </span>
            )}
          </Navbar.Brand>
          <Navbar.Toggle className="border-0">
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          {showNavigationOptions && (
            <Navbar.Collapse>
              <Nav className="ms-auto px-2 px-lg-0 pb-4 pb-lg-0 gap-2">
                {links.map((link, key) => (
                  <Link key={key} href={link.href} passHref legacyBehavior>
                    <Nav.Link as="a">
                      {capitalizeText(link.text.toLowerCase(), 'simple')}
                    </Nav.Link>
                  </Link>
                ))}
                <Nav.Item className="d-inline-flex align-items-center">
                  <LanguageSelector theme="dark-blue" />
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
      {subLinks.hasItems() && (
        <Navbar variant="light" bg="light" className="shadow" sticky="top">
          <Container className="px-lg-1">
            <Nav>
              {subLinks.map((link, key) => (
                <Link key={key} href={link.href} passHref legacyBehavior>
                  <Nav.Link as="a">
                    {capitalizeText(link.text.toLowerCase(), 'simple')}
                  </Nav.Link>
                </Link>
              ))}
            </Nav>
          </Container>
        </Navbar>
      )}
    </Fragment>
  )
}

export default NavBar
