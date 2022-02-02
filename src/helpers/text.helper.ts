import { DEFAULT_TITLE } from './defaults.helpers'

export const getPageTitle = (pageTitle: string, baseTitle = DEFAULT_TITLE) => pageTitle
  .trim()
  .concat(surroundText('-'))
  .concat(baseTitle)

export const surroundText = (text: string, surroundChar = ' ') =>
  new Array(2).fill(surroundChar).join(text)

export const capitalizeText = (text: string, mode: 'simple' | 'full' = 'full') => mode === 'full'
  ? Array.from(text)
    .map((char, index) => (text.charAt(index - 1) === String(' ') || index === 0)
      ? char.toUpperCase()
      : char)
    .join(String())
  : text.charAt(0).toUpperCase().concat(text.substring(1).toLowerCase())

export const splitCamelCaseText = (key: string) => Array.from(key)
  .map(char => char === char.toUpperCase() && char.trim() !== String()
    ? ' '.concat(char)
    : char.trim())
  .join(String())

export const getFancyNameFromProp = (prop: string) => capitalizeText(splitCamelCaseText(prop))
