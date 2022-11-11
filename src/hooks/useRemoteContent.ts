import { type DependencyList } from "react"
import { useAsyncMemo } from "./useAsyncMemo"

interface FinishedFetchState extends Boolean {}

type RemoteContentHookConfig = {
  path: string | URL
}

export const useRemoteContent = (
  config: RemoteContentHookConfig,
  deps: DependencyList = []
): [ReadableStream<Uint8Array> | null | undefined, FinishedFetchState] => {
  const { data: result, isLoading } = useAsyncMemo(
    async () => await fetch(config.path, {
      mode: 'cors',
    }),
    deps)
  return [result?.body, isLoading]
}
