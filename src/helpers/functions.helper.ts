// @ts-nocheck
export function recursiveCall(fn: () => T) {
  return function () {
    return fn.apply(this as () => T, arguments)
  }
}
