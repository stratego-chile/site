import { Navbar, Container, Image } from 'react-bootstrap'

const NavBar: RootComponent = () => {
  return (
    <Navbar variant='dark' bg="dark" expand="lg">
      <Container>
        <Navbar.Brand className='mx-auto fw-bold py-2'>
          <Image
            alt="Stratego"
            src={'https://stratego-public-assets.s3.amazonaws.com/landing/logo-colored.svg'}
            style={{ height: '3rem' }}
            fluid
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavBar
