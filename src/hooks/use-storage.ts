import { isSerializable } from '@stratego/helpers/assert.helper'
import { useCallback, useMemo } from 'react'

const DEFAULT_STORAGE_ITEM_PREFIX = 'Stratego_data-'

type StorageConfig = {
  defaultStorage?: Storage
  itemPrefix?: string
  parseObjects?: boolean
}

/**
 * An SSR-ready storage hook
 */
export const useStorage = (storageConfig?: StorageConfig) => {
  const {
    defaultStorage,
    itemPrefix = DEFAULT_STORAGE_ITEM_PREFIX,
    parseObjects = true,
  } = storageConfig || {}

  const storageAccessor: Storage | undefined = useMemo(
    () =>
      defaultStorage
        ? defaultStorage
        : typeof window !== 'undefined'
          ? window.localStorage
          : undefined,
    [defaultStorage]
  )

  const getStorageItem = useCallback(
    (itemKey: string) => {
      const item = storageAccessor?.getItem(
        itemPrefix ? itemPrefix.concat(itemKey) : itemKey
      )

      return item
        ? parseObjects && isSerializable(item)
          ? JSON.parse(item)
          : item
        : undefined
    },
    [itemPrefix, parseObjects, storageAccessor]
  )

  const setStorageItem = useCallback(
    (itemKey: string, itemValue: any) => {
      if (itemKey && itemValue)
        storageAccessor?.setItem(
          itemPrefix ? itemPrefix.concat(itemKey) : itemKey,
          itemValue instanceof Object
            ? JSON.stringify(itemValue)
            : String(itemValue)
        )

      return itemKey ? !!getStorageItem(itemKey) : false
    },
    [getStorageItem, itemPrefix, storageAccessor]
  )

  const getStorage: Record<string, any> = useCallback(() => {
    let storage: Record<string, any> = {}

    if (storageAccessor)
      Object.keys(storageAccessor).forEach((key) => {
        storage[key] = getStorageItem(key)
      })

    return storage
  }, [getStorageItem, storageAccessor])

  return {
    getStorage,
    getStorageItem,
    setStorageItem,
  }
}
