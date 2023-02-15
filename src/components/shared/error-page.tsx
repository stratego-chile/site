import GoBackButton from '@stratego/components/shared/go-back-button'
import { capitalizeText } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import type { FC } from 'react'

const Container = dynamic(() => import('react-bootstrap/Container'))

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

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

ErrorPage.propTypes = {
  relativeHeight: PropTypes.bool,
  showGoBackButton: PropTypes.bool,
  statusCode: PropTypes.number,
}

ErrorPage.defaultProps = {
  showGoBackButton: true,
  relativeHeight: false,
}

ErrorPage.displayName = 'ErrorPage'

export default ErrorPage
