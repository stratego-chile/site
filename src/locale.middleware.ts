import { i18n } from '../next-i18next.config'

export const { defaultLocale } = i18n

function middleware() {
  return i18n.locales
}

export default middleware
