import { useAsyncMemo } from "./useAsyncMemo"

export const useRemoteContent = (path: string): [ReadableStream<Uint8Array> | null | undefined, boolean] => {
  const { data: result, isLoading } = useAsyncMemo(async () => await fetch(path), [path])
  return [result?.body, isLoading]
}
