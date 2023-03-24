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
import { Fragment, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavBarLinks, {
  lazySubLink,
} from '@stratego/components/misc/navbar-links'

const MobileSidebar = dynamic(
  import('@stratego/components/misc/mobile-sidebar')
)

type NavBarProps = {
  showNavigationOptions?: boolean
  theme?: string
  brandDepartment?: string
  subLinks?: Array<LinkSpec>
}

const LanguageSelector = dynamic(
  () => import('@stratego/components/shared/language-selector')
)

const NavBar: React.FC<NavBarProps> = ({
  showNavigationOptions,
  theme = 'dark-blue',
  brandDepartment,
  subLinks = [],
}) => {
  const { t } = useTranslation(['common', 'sections'])

  const [collapsed, setCollapsed] = useState<boolean>(true)

  return (
    <Fragment>
      <Navbar
        variant="dark"
        bg={theme}
        expand="xxl"
        className="position-static"
      >
        <Container className="px-xl-1">
          <Link href="/home" legacyBehavior passHref>
            <Navbar.Brand className="d-flex fw-bold gap-3 py-3 px-2">
              <Image
                className={classNames('d-block', NavbarStyles.brandImage)}
                src={getAssetPath('logo-white.svg')}
                alt={process.env.BRAND_NAME}
                fluid
              />
              {brandDepartment && (
                <Fragment>
                  <div className="vr d-none d-xl-inline-block" />
                  <span
                    className={classNames(
                      'fw-normal text-wrap',
                      NavbarStyles.brandDepartment
                    )}
                  >
                    {capitalizeText(brandDepartment, 'simple')}
                  </span>
                </Fragment>
              )}
            </Navbar.Brand>
          </Link>
          {showNavigationOptions && (
            <Fragment>
              <Navbar.Toggle
                className="border-0"
                onClick={() => setCollapsed(($collapsed) => !$collapsed)}
              >
                <FontAwesomeIcon icon={faBars} />
              </Navbar.Toggle>
              <Navbar.Collapse className="d-none d-xxl-inline-flex">
                <Nav className="ms-auto px-xl-0 pb-xl-0 row-gap-2 fw-semibold gap-4 px-2 pb-4 text-center">
                  <NavBarLinks links={navbarLinks} />
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
            </Fragment>
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
            <Nav className="row-gap-2 gap-4">
              <NavBarLinks links={subLinks} />
            </Nav>
          </Container>
        </Navbar>
      )}
      <MobileSidebar show={!collapsed} onClose={() => setCollapsed(true)} />
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
