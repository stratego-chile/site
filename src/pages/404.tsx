import { Button, Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { type NextPage } from 'next'

const NotFoundPage: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const title = 'resource not found'

  return (
    <Container className="d-flex min-vh-100 flex-column">
      <Row className="d-flex flex-grow-1 align-self-stretch align-content-center">
        <Col className="d-flex flex-column text-center gap-4">
          <span className="d-flex flex-column">
            <span className="fs-1 fw-bold">404</span>
            <code className="fs-6">{capitalizeText(title, 'simple')}</code>
          </span>
          <Button
            className="mx-auto rounded-circle"
            variant="outline-dark"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFoundPage
