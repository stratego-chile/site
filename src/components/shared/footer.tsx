import type { IsolatedComponent } from '@stratego/types'
import { Col, Container, Row } from 'react-bootstrap'
import FooterStyles from '@stratego/styles/modules/Footer.module.sass'
import { useStyleModules } from '@stratego/helpers/styles.helper'

const Footer: IsolatedComponent = () => {
  return (
    <Container fluid className={useStyleModules(FooterStyles.Container, 'py-2')}>
      <Row>
        <Col className='text-center'>
          <span>Stratego &reg; { new Date().getFullYear() }</span>
        </Col>
      </Row>
    </Container>
  )
}

export default Footer
