import isPlainObject from 'lodash.isplainobject'

export const isSerializable = (item: any) => {
  let isNestedSerializable = false

  const isPlain = (val: any) => {
    return (
      typeof val === 'undefined' ||
      typeof val === 'string' ||
      typeof val === 'boolean' ||
      typeof val === 'number' ||
      Array.isArray(val) ||
      isPlainObject(val)
    )
  }

  if (!isPlain(item)) return false

  for (const property in item) {
    if (item.hasOwnProperty(property)) {
      if (!isPlain(item[property])) return false

      if (typeof item[property] == 'object') {
        isNestedSerializable = isSerializable(item[property])

        if (!isNestedSerializable) return false
      }
    }
  }

  return true
}

type SimilarityOptions = {
  /**
   * The percentage of similarity between two strings.
   *
   * Is an integer or float number between 0 and 100.
   */
  syntheticPercentage?: number
}

const defaultSyntheticSimilarityPercentage = 0x000050

/**
 * Get the similarity percentage between two strings.
 *
 * Based on the [Jaro–Winkler similarity distance algorithm](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance).
 *
 * Based on the [@sumn2u's Gist](https://gist.github.com/sumn2u/0e0b5d9505ad096284928a987ace13fb#file-jaro-wrinker-js)
 */
export const isSimilar = (
  comparator: string,
  criteria: string,
  options?: SimilarityOptions
) => {
  const syntheticPercentage =
    options?.syntheticPercentage ?? defaultSyntheticSimilarityPercentage

  if (syntheticPercentage < 0 || syntheticPercentage > 100) {
    throw new TypeError(
      `The synthetic percentage must be an integer or float number between 0 and 100.`
    )
  }

  const calculateStringsSimilarity = (
    firstString: string,
    secondString: string
  ) => {
    let matchesFound = 0

    if (firstString.trim() === secondString.trim()) return 100

    const range =
      Math.floor(Math.max(firstString.length, secondString.length) / 2) - 1
    const matchesInFirstString = new Array(firstString.length)
    const matchesInSecondString = new Array(secondString.length)

    new Array(firstString.length)
      .fill(null)
      .forEach((_, firstStringCharIndex) => {
        const high =
          firstStringCharIndex + range <= secondString.length
            ? firstStringCharIndex + range
            : secondString.length - 1

        let low =
          firstStringCharIndex >= range ? firstStringCharIndex - range : 0

        while (low <= high) {
          if (
            !matchesInFirstString[firstStringCharIndex] &&
            !matchesInSecondString[low] &&
            firstString[firstStringCharIndex] === secondString[low]
          ) {
            ++matchesFound
            matchesInFirstString[firstStringCharIndex] = matchesInSecondString[
              low
            ] = true
            low = high
          }
          low++
        }
      })

    if (matchesFound === 0) return 0

    let transpositionsCounterIndex = 0,
      transpositions = 0

    new Array(firstString.length)
      .fill(null)
      .forEach((_, firstStringCharIndex) => {
        if (matchesInFirstString[firstStringCharIndex]) {
          while (transpositionsCounterIndex < secondString.length) {
            if (matchesInSecondString[transpositionsCounterIndex]) {
              transpositionsCounterIndex += 1
              break
            }
            if (
              firstString[firstStringCharIndex] !==
              secondString[transpositionsCounterIndex]
            ) {
              ++transpositions
            }
            transpositionsCounterIndex++
          }
        }
      })

    let weight =
      (matchesFound / firstString.length +
        matchesFound / secondString.length +
        (matchesFound - transpositions / 2) / matchesFound) /
      3

    let lengthPrefix = 0

    const scoreScalingFactor = 0.1

    if (weight > 0.7) {
      while (
        firstString[lengthPrefix] === secondString[lengthPrefix] &&
        lengthPrefix < 4
      )
        ++lengthPrefix
      weight = weight + lengthPrefix * scoreScalingFactor * (1 - weight)
    }

    return weight * 100
  }

  const validateComparison = (percentage: number) => {
    return percentage >= syntheticPercentage
  }

  return validateComparison(calculateStringsSimilarity(comparator, criteria))
}
