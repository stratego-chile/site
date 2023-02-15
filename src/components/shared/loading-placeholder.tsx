import PropTypes from 'prop-types'
import { type FC } from 'react'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

type LoadingPlaceholderProps = {
  loading?: boolean
  error?: Error | null
}

const LoadingPlaceholder: FC<LoadingPlaceholderProps> = ({
  loading = true,
  error,
}) => {
  return loading ? (
    <div
      style={{ height: 'inherit', width: 'inherit' }}
      className="text-center my-5"
    >
      <Spinner />
    </div>
  ) : error ? (
    <Alert variant="danger">{error.toString()}</Alert>
  ) : null
}

LoadingPlaceholder.propTypes = {
  error: PropTypes.instanceOf(Error),
  loading: PropTypes.bool,
}

LoadingPlaceholder.defaultProps = {
  loading: true,
}

LoadingPlaceholder.displayName = 'LoadingPlaceholder'

export default LoadingPlaceholder
