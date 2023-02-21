import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { navbarLinks, type LinkSpec } from '@stratego/data/navigation-links'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import NavbarStyles from '@stratego/styles/modules/Navbar.module.sass'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Fragment, useMemo, type FC } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavBarLinks, {
  lazySubLink,
} from '@stratego/components/misc/navbar-links'

type NavBarProps = {
  showNavigationOptions?: boolean
  theme?: string
  brandDepartment?: string
  subLinks?: Array<LinkSpec>
}

const LanguageSelector = dynamic(
  () => import('@stratego/components/shared/language-selector')
)

const NavBar: FC<NavBarProps> = ({
  showNavigationOptions,
  theme = 'dark-blue',
  brandDepartment,
  subLinks = [],
}) => {
  const { t } = useTranslation(['common', 'sections'])

  const links = useMemo<Array<LinkSpec>>(() => navbarLinks, [])

  return (
    <Fragment>
      <Navbar
        variant="dark"
        bg={theme}
        expand="xxl"
        className="position-static"
        style={{ zIndex: 1050 }}
      >
        <Container className="px-xl-1">
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
                    'fw-normal border-xl-start ps-xl-3 text-wrap',
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
              <Nav className="ms-auto px-2 px-xl-0 pb-4 pb-xl-0 gap-4 row-gap-2 fw-semibold text-center">
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
      {subLinks.hasItems && (
        <Navbar
          variant="dark"
          bg="dark-blue"
          className={classNames('shadow')}
          sticky="top"
        >
          <Container className="px-xl-1 fw-semibold">
            <Nav className="gap-4 row-gap-2">
              <NavBarLinks links={subLinks} />
            </Nav>
          </Container>
        </Navbar>
      )}
    </Fragment>
  )
}

NavBar.propTypes = {
  showNavigationOptions: PropTypes.bool,
  theme: PropTypes.oneOf(['dark-blue', 'light-blue']),
  brandDepartment: PropTypes.string,
  subLinks: PropTypes.arrayOf(lazySubLink),
}

NavBar.defaultProps = {
  theme: 'dark-blue',
  subLinks: [],
}

NavBar.displayName = 'TopNavigationBar'

export default NavBar
