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

export default LoadingPlaceholder
