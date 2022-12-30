import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useRouter } from 'next/router'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'next-i18next'
import { FC } from 'react'

type ErrorPageProps = {
  statusCode?: number
  showGoBackButton?: boolean
}

const ErrorPage: FC<ErrorPageProps> = ({
  statusCode,
  showGoBackButton = true,
}) => {
  const router = useRouter()

  const { t } = useTranslation('common')

  return (
    <Container className="d-flex min-vh-100 flex-column">
      <Row className="d-flex flex-grow-1 align-self-stretch align-content-center">
        <Col className="d-flex flex-column text-center gap-4">
          <span className="d-flex flex-column">
            {statusCode && <span className="fs-1 fw-bolder">{statusCode}</span>}
            <span className="fs-3 fw-semibold text-secondary">
              {capitalizeText(
                statusCode === 404
                  ? t`common:errors.notFound`
                  : t`common:errors.unknown`,
                'simple'
              )}
            </span>
          </span>
          {showGoBackButton && (
            <Button
              className="mx-auto rounded-pill"
              variant="outline-dark-blue"
              onClick={() => router.back()}
            >
              <span className="fs-6">
                <FontAwesomeIcon icon={faArrowLeft} fixedWidth size="1x" />
                &ensp;{capitalizeText(t`common:goBack`, 'simple')}
              </span>
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ErrorPage
