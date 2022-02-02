import type { IsolatedComponent } from '@stratego/types'
import { Navbar, Container } from 'react-bootstrap'

const NavBar: IsolatedComponent = () => {
  return (
    <Navbar variant='dark' bg="dark" expand="lg">
      <Container>
        <Navbar.Brand className='mx-auto fw-bold'>Stratego</Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavBar
