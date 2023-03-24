import { useState } from 'react'
import { useAsyncMemo } from '@stratego/hooks/use-async-memo'

interface Fetching extends Boolean {}
interface ResourceFound extends Boolean {}

type RemoteContentHookConfig = {
  path: string | URL
}

export const useRemoteContent = (
  config: RemoteContentHookConfig,
  deps: React.DependencyList = []
): {
  content?: ReadableStream<Uint8Array> | null
  fetching: Fetching
  resourceFound: ResourceFound
} => {
  const [found, setFound] = useState(false)

  const { data: result, isLoading } = useAsyncMemo(async () => {
    return new Promise<Response>((resolve) => {
      fetch(config.path, {
        method: 'GET',
        mode: 'cors',
      })
        .then((response) => {
          if (response.status === 200) setFound(true)
          resolve(response)
        })
        .catch(() => {
          resolve(new Response(null))
        })
    })
  }, deps)

  return {
    content: result?.body,
    fetching: isLoading,
    resourceFound: found,
  }
}
