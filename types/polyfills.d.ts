declare interface ObjectConstructor {
  keys<T extends object>(o: T): Array<keyof T | string>
}

interface Array<T> {
  /**
   * Groups the elements of the calling array according to the string values returned by a provided testing function.
   * The returned object has separate properties for each group, containing arrays with the elements in the group.
   *
   * @experimental
   *
   * @param callbackFn - A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   *
   * @param thisArg - An object to which the this keyword can refer in the predicate function. If thisArg is omitted,undefined is used as the this value.
   *
   * @polyfill {@link https://github.com/zloirock/core-js/blob/master/packages/core-js/actual/array/group.js}
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group}
   */
  group<K extends keyof any>(
    callbackFn: (element: T, index: number, array: T[]) => K,
    thisArg?: ThisType
  ): Record<K, T[]>

  /**
   * Groups the elements of the calling array using the values returned by a provided testing function.
   * The final returned [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
   * uses the unique values from the test function as keys, which can be used to get the array of elements in each
   * group.
   *
   * @experimental
   *
   * @param callbackFn - A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   *
   * @param thisArg - An object to which the this keyword can refer in the predicate function. If thisArg is omitted,undefined is used as the this value.
   *
   * @polyfill {@link https://github.com/zloirock/core-js/blob/master/packages/core-js/actual/array/group-to-map.js}
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap}
   */
  groupToMap<S extends T>(
    callbackFn: (element: T, index: number, array: T) => element is S,
    thisArg?: ThisType
  ): Map<true, S[]> & Map<false, Exclude<T, S>[]>
  groupToMap<K>(
    callbackFn: (element: T, index: number, array: T[]) => K,
    thisArg?: ThisType
  ): Map<K, T[]>

  /**
   * Returns `true` if the array contains at least one element, `false` otherwise.
   *
   * @experimental
   *
   * @internal
   */
  hasItems(): boolean

  /**
   * Returns `true` if all items in the list are the same instance as the comparator, otherwise `false`.
   *
   * @param comparator - Object instance to be compared to the array items
   *
   * @experimental
   *
   * @internal
   */
  clonesOf<S extends T>(comparator: S): boolean
}

interface ReadonlyArray<T> {
  /**
   * Groups the elements of the calling array according to the string values returned by a provided testing function.
   * The returned object has separate properties for each group, containing arrays with the elements in the group.
   *
   * @experimental
   *
   * @param callbackFn - A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   *
   * @param thisArg - An object to which the this keyword can refer in the predicate function. If thisArg is omitted,undefined is used as the this value.
   *
   * @polyfill {@link https://github.com/zloirock/core-js/blob/master/packages/core-js/actual/array/group.js}
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group}
   */
  group<K extends keyof any>(
    callbackFn: (element: T, index: number, array: readonly T[]) => K,
    thisArg?: ThisType
  ): Record<K, T[]>

  /**
   * Groups the elements of the calling array using the values returned by a provided testing function.
   * The final returned [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
   * uses the unique values from the test function as keys, which can be used to get the array of elements in each
   * group.
   *
   * @experimental
   *
   * @param callbackFn - A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   *
   * @param thisArg - An object to which the this keyword can refer in the predicate function. If thisArg is omitted,undefined is used as the this value.
   *
   * @polyfill {@link https://github.com/zloirock/core-js/blob/master/packages/core-js/actual/array/group-to-map.js}
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap}
   */
  groupToMap<S extends T>(
    callbackFn: (value: T, index: number, obj: T) => value is S,
    thisArg?: ThisType
  ): Map<true, S[]> & Map<false, Exclude<T, S>[]>
  groupToMap<K>(
    callbackFn: (value: T, index: number, obj: readonly T[]) => K,
    thisArg?: ThisType
  ): Map<K, T[]>

  /**
   * Returns `true` if the array contains at least one element, `false` otherwise.
   *
   * @experimental
   *
   * @internal
   */
  hasItems(): boolean

  /**
   * Returns `true` if all items in the list are the same instance as the comparator, otherwise `false`.
   *
   * @param comparator - Object instance to be compared to the array items
   *
   * @experimental
   *
   * @internal
   */
  clonesOf<S extends T>(comparator: S): boolean
}
