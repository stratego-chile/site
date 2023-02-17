;(() => {
  // Add `hasItems` function to Array prototype in isolated mode
  const hasItems = 'hasItems'
  if (!Object.prototype.hasOwnProperty.call(Array.prototype, hasItems)) {
    Object.defineProperty(Array.prototype, hasItems, {
      enumerable: false,
      configurable: false,
      get: function () {
        return this.length > 0
      },
    })
  }

  // Add `surround` function to String prototype in isolated mode
  const surround = 'surround'
  if (!Object.prototype.hasOwnProperty.call(String, surround)) {
    Object.defineProperty(String, surround, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 'static',
    })
    String.prototype[surround] = function (wrapper = ' ') {
      return new Array<string>(2).fill(wrapper).join(this.valueOf())
    }
  }
})()

export {}
