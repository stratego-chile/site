import { useEffect, useState } from 'react'
import * as UUID from 'uuid'

export const useUniqueId = (config?: UUID.V4Options) => {
  const [id, setId] = useState(UUID.NIL)

  useEffect(() => {
    setId(UUID.v4(config))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return id
}
