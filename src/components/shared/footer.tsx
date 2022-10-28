import { Col, Container, Row } from 'react-bootstrap'
import FooterStyles from '@stratego/styles/modules/Footer.module.sass'
import classNames from 'classnames'

const Footer: RootComponent = () => {
  return (
    <Container fluid className={classNames(FooterStyles.Container, 'py-2')}>
      <Row>
        <Col className='text-center'>
          <span>{`Stratego S.p.A ® ${new Date().getFullYear()} - Chile`}</span>
        </Col>
      </Row>
    </Container>
  )
}

export default Footer
