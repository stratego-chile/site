import Link from 'next/link'
import { type FC } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { capitalize } from '@stdlib/string'

export type Links = Array<{
  href: string
  text: string
}>

type SubNavBarProps = {
  links?: Links
}

const SubNavBar: FC<SubNavBarProps> = ({ links }) => {
  return (
    <Navbar
      variant="light"
      bg="light"
      className="sticky-top shadow"
      expand="lg"
    >
      <Container className="px-lg-1">
        <Nav>
          {links?.map((link, key) => (
            <Link key={key} href={link.href} passHref legacyBehavior>
              <Nav.Link as="a">
                {capitalize(link.text.toLowerCase())}
              </Nav.Link>
            </Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default SubNavBar
