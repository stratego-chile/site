import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { useTranslation } from 'next-i18next'
import { FC } from 'react'
import classNames from 'classnames'
import GoBackButton from '@stratego/components/shared/go-back-button'

type ErrorPageProps = {
  statusCode?: number
  showGoBackButton?: boolean
  relativeHeight?: boolean
}

const ErrorPage: FC<ErrorPageProps> = ({
  statusCode,
  showGoBackButton = true,
  relativeHeight = false,
}) => {
  const { t } = useTranslation('common')

  return (
    <Container
      className={classNames(
        'd-flex flex-column',
        !relativeHeight && 'min-vh-100'
      )}
    >
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
          {showGoBackButton && <GoBackButton />}
        </Col>
      </Row>
    </Container>
  )
}

export default ErrorPage
