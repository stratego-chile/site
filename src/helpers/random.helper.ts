import shuffle from '@stdlib/random/shuffle'

type RandomPickOptions = {
  /**
   * Key - is the position of the item in the array.
   * Value - is the item selection probability
   */
  syntheticWeight?: Record<number, number>
}

export const randomPick = <T extends string | number | boolean | object>(
  dataSet: Array<T>,
  options?: RandomPickOptions
) => {
  let dataToPickFrom = Object.create(dataSet) as typeof dataSet

  dataToPickFrom = Array.from(new Set([...dataToPickFrom]))

  if (options) {
    const { syntheticWeight: syntheticProbability } = options

    if (syntheticProbability) {
      const accumulatedDefinedProbability = Object.values(
        syntheticProbability
      ).reduce((previous, current) => previous + current, 0)

      if (accumulatedDefinedProbability > 1)
        throw new Error(
          'The sum of the defined probabilities must NOT be greater than 1'
        )

      const notDefinedProbabilities = dataSet.slice().filter((_, index) => {
        return !syntheticProbability[index]
      })

      const defaultProbability =
        (1 - accumulatedDefinedProbability) / notDefinedProbabilities.length

      const sortedOptions = dataSet.slice().sort((current, next) => {
        const currentIndex = dataSet.indexOf(current)

        const nextIndex = dataSet.indexOf(next)

        const currentProbability =
          syntheticProbability[currentIndex] ?? defaultProbability

        const nextProbability =
          syntheticProbability[nextIndex] ?? defaultProbability

        return nextProbability - currentProbability
      })

      const $dataToPickFrom: Array<(typeof dataSet)[number]> = []

      sortedOptions.forEach((option) => {
        const optionIndex = dataSet.indexOf(
          dataSet.find(($option) => $option === option)!
        )

        const optionProbability =
          syntheticProbability[optionIndex] || defaultProbability

        const timesToRepeat = Math.ceil(
          (optionProbability / dataSet.length) * 100
        )

        $dataToPickFrom.push(...new Array(timesToRepeat).fill(option))

        dataToPickFrom =
          $dataToPickFrom.length === 2
            ? $dataToPickFrom
            : Array.from(shuffle($dataToPickFrom))
      })
    }
  }

  const selectedIndex = (dataToPickFrom.length === 2 ? Math.round : Math.floor)(
    dataToPickFrom.length === 2
      ? Math.random()
      : Math.random() * dataToPickFrom.length
  )

  const selectedOption = dataToPickFrom[selectedIndex]

  return selectedOption
}
