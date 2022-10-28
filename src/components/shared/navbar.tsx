import { Navbar, Container, Image } from 'react-bootstrap'
import ColoredLogo from '@stratego/assets/vectors/logo-colored.svg'

const NavBar: RootComponent = () => {
  return (
    <Navbar variant='dark' bg="dark" expand="lg">
      <Container>
        <Navbar.Brand className='mx-auto fw-bold py-2'>
          <Image alt="Stratego" src={ColoredLogo.src} style={{ height: '3rem' }} fluid />
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavBar
