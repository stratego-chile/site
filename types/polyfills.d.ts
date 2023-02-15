interface String {
  surround(wrapper?: string): string
}

interface ArrayPolyfill {
  /**
   * Returns `true` if the array contains at least one element, `false` otherwise.
   *
   * @motivation Since Array.length cannot being used as a numeric criteria when the array is not verified as defined
   * yet, this method is a convenient way to check if an array has items.
   *
   * @example `[]?.length > 0` now becomes `[]?.hasItems()`
   *
   * @experimental
   *
   * @internal
   */
  hasItems(): boolean
}

interface Array extends ArrayPolyfill {}

interface ReadonlyArray extends ArrayPolyfill {}
