import { type DependencyList } from 'react'
import { useAsyncMemo } from '@stratego/hooks/useAsyncMemo'

interface FinishedFetchState extends Boolean {}

type RemoteContentHookConfig = {
  path: string | URL
}

export const useRemoteContent = (
  config: RemoteContentHookConfig,
  deps: DependencyList = []
): [ReadableStream<Uint8Array> | null | undefined, FinishedFetchState] => {
  const { data: result, isLoading } = useAsyncMemo(async () => {
    const response = await fetch(config.path, {
      mode: 'cors',
    })
    return response
  }, deps)
  return [result?.body, isLoading]
}
