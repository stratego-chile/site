// @ts-check
const path = require('path')

const isDebugging = process.env.NODE_ENV !== 'production'

const isBrowserContextActive = typeof window !== 'undefined'

/**
 * @type {import('next-i18next').UserConfig}
 */
const nextI18NextConfig = {
  /**
   * @type {import('./src/lib/locales').Locale}
   */
  fallbackLng: 'es-CL',
  i18n: {
    /**
     * @type {Array<import('./src/lib/locales').Locale>}
     */
    locales: ['es-CL'],
    /**
     * @type {import('./src/lib/locales').Locale}
     */
    defaultLocale: 'es-CL',
    localeDetection: false,
  },
  react: {
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'a', 'b', 'u', 'small', 'sup', 'sub'],
    useSuspense: false,
  },
  localePath: !isBrowserContextActive
    ? path.resolve('.', 'public', 'locales')
    : '/locales',
  reloadOnPrerender: isDebugging,
}

module.exports = nextI18NextConfig
