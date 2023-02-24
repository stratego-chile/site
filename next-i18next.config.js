// @ts-check
const path = require('path')

const devMode = process.env.NODE_ENV !== 'production'

/**
 * @type {import('next-i18next').UserConfig}
 */
const nextI18NextConfig = {
  /**
   * @type {Stratego.Common.Locale}
   */
  fallbackLng: 'es-CL',
  i18n: {
    /**
     * @type {Array<Stratego.Common.Locale>}
     */
    locales: ['es-CL', 'en-US', 'pt-BR'],
    /**
     * @type {Stratego.Common.Locale}
     */
    defaultLocale: 'es-CL',
    localeDetection: false,
  },
  react: {
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'a', 'b', 'u', 'small', 'sup', 'sub'],
    useSuspense: false,
  },
  localePath: typeof window === 'undefined'
    ? path.resolve('.', 'public', 'locales')
    : '/locales',
  reloadOnPrerender: devMode,
}

module.exports = nextI18NextConfig
