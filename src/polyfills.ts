import 'core-js/features/array/group'
import 'core-js/features/array/group-to-map'

// Add `hasItems` function to Array prototype in isolated mode
;(() => {
  const hasItems = 'hasItems'
  if (!Object.prototype.hasOwnProperty.call(Array, hasItems)) {
    Object.defineProperty(Array, hasItems, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 'static',
    })
    Array.prototype[hasItems] = function () {
      return this.length > 0
    }
  }
})()

// Add `clonesOf` function to Array prototype in isolated mode
;(() => {
  const clonesOf = 'clonesOf'
  if (!Object.prototype.hasOwnProperty.call(Array, clonesOf)) {
    Object.defineProperty(Array, clonesOf, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 'static',
    })
    Array.prototype[clonesOf] = function (comparator) {
      return this.every((item) =>
        item instanceof Object
          ? Object.is(comparator, item)
          : item === comparator
      )
    }
  }
})()
