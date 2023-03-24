import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

type LoadingPlaceholderProps = {
  loading?: boolean
  error?: Error | null
}

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  loading = true,
  error,
}) => {
  return loading ? (
    <div
      style={{ height: 'inherit', width: 'inherit' }}
      className="my-5 text-center"
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
