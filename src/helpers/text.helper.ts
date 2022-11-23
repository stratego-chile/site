import { DEFAULT_TITLE } from './defaults.helpers'
import { capitalize } from '@stdlib/string'

export const getPageTitle = (pageTitle: string, baseTitle = DEFAULT_TITLE) =>
  pageTitle.trim().concat('-'.surround()).concat(baseTitle)

export const getCountryFlagEmoji = (iso: string) =>
  iso
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(char.charCodeAt(0) + 0x01f1a5)
    )

export const capitalizeText = (
  text: string,
  mode: 'simple' | 'full' = 'full'
) =>
  mode === 'full'
    ? Array.from(text)
        .map((char, index) =>
          text.charAt(index - 1) === String(' ') || index === 0
            ? char.toUpperCase()
            : char
        )
        .join(String())
    : capitalize(text)

export const splitCamelCaseText = (key: string) =>
  Array.from(key)
    .map((char) =>
      char === char.toUpperCase() && char.trim() !== String()
        ? ' '.concat(char)
        : char.trim()
    )
    .join(String())

export const getFancyNameFromProp = (prop: string) =>
  capitalizeText(splitCamelCaseText(prop))
