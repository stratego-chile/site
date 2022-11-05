import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { type FC, Fragment } from 'react'
import { Navbar, Container, Image, Nav } from 'react-bootstrap'
import Link from 'next/link'
import { capitalize } from '@stdlib/string'
import { useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'

type NavBarProps = {
  showNavigationOptions?: boolean
  brandDepartment?: string
}

type NavLinkSpec = {
  href: string
  text: string
}

const NavBar: FC<NavBarProps> = ({
  showNavigationOptions,
  brandDepartment
}) => {
  const { t } = useTranslation(['common', 'sections'])

  const links: Array<NavLinkSpec> = [
    {
      href: '/',
      text: t('sections:home.title'),
    },
    {
      href: '/security',
      text: t('sections:security.title')
    }
  ]

  // #3838DB

  return (
    <Navbar
      variant={showNavigationOptions ? 'dark' : 'light'}
      bg={showNavigationOptions ? 'dark' : 'white'}
      expand="lg"
    >
      <Container>
        <Navbar.Brand className='d-grid d-lg-flex mx-auto fw-bold py-3 px-2 gap-3'>
          <Image
            className="d-block mx-auto"
            src={getAssetPath('logo-colored.svg')}
            alt="Stratego"
            style={{ height: '2rem' }}
            fluid
          />
          {brandDepartment && (
            <span className="fw-light border-lg-start ps-lg-3">
              {capitalizeText(brandDepartment, 'simple')}
            </span>
          )}
        </Navbar.Brand>
        {showNavigationOptions && (
          <Fragment>
            <Navbar.Collapse>
              <Nav className="ms-auto">
                {links.map((link, key) => (
                  <Link key={key} href={link.href} passHref legacyBehavior>
                    <Nav.Link as="a">
                      {capitalize(link.text.toLowerCase())}
                    </Nav.Link>
                  </Link>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Fragment>
        )}
      </Container>
    </Navbar>
  )
}

export default NavBar
