import {
  type DependencyList,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react'

const RECOMMENDED_DEPS_LENGTH = 3

/**
 * Transform an async workflow to a reactive and state-ready hook.
 * @param promiseFunction A function that returns a Promise
 * @param deps Dependencies for the requestFunction
 * @returns The fetching state and the fetched data
 */
export const useAsyncMemo = <T = unknown>(
  promiseFunction: () => Promise<T>,
  deps: DependencyList
) => {
  const [data, setData] = useState<T | undefined>(undefined)
  const [errorReason, setErrorReason] = useState<Error>()
  const [isLoading, setLoadingState] = useState(!data && !errorReason)
  const [attempts, setAttempts] = useState(1)

  const hasErrors = useMemo(() => !!errorReason, [errorReason])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const $promiseFunction = useCallback(promiseFunction, [...deps, attempts])

  const logger = console

  useEffect(() => {
    setLoadingState(true)
    const executeRequest = () => {
      // Now, we must reset the data and error states
      // Both setters are called before the execution of the promise function
      // This is not a problem since the promise function does not depend on these states values
      // And only one of these states will be updated after the execution of the promise

      setData(undefined)
      setErrorReason(undefined)

      $promiseFunction()
        .then(setData)
        .catch((promiseError) => {
          logger.error(promiseError)
          setErrorReason(promiseError)
        })
        .finally(() => setLoadingState(false))
    }
    executeRequest()
  }, [$promiseFunction, logger])

  if (deps.length > RECOMMENDED_DEPS_LENGTH)
    logger.warn('useAsyncMemo:', 'Too many dependencies')

  return {
    isLoading,
    data,
    hasErrors,
    errorReason,
    retry: () => setAttempts(($attempts) => ++$attempts),
    attempts,
  }
}
