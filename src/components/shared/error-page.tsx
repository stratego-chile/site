import GoBackButton from '@stratego/components/shared/go-back-button'
import { capitalizeText } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import { StatusCodes } from 'http-status-codes'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import type { ContainerProps } from 'react-bootstrap/Container'

const Container = dynamic(
  () =>
    import('react-bootstrap/Container') as unknown as Promise<
      React.ComponentType<React.HTMLAttributes<HTMLElement> & ContainerProps>
    >
)

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

type ErrorPageProps = {
  statusCode?: StatusCodes
  showGoBackButton?: boolean
  relativeHeight?: boolean
}

const ErrorPage: React.FC<ErrorPageProps> = ({
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
        <Col className="d-flex flex-column gap-4 text-center">
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

ErrorPage.displayName = 'ErrorPage'

export default ErrorPage
