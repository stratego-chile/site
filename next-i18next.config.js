const path = require('path')

const devMode = process.env.NODE_ENV !== 'production'

// @ts-check
/**
 * @type {import('next-i18next').UserConfig}
 */
const nextI18NextConfig = {
  i18n: {
    /**
     * @type {Array<AvailableLocales>}
     */
    locales: ['es-CL', 'en-US', 'pt-BR'],
    /**
     * @type {AvailableLocales}
     */
    defaultLocale: 'es-CL',
    localeDetection: false,
  },
  /**
   * @type {AvailableLocales}
   */
  fallbackLng: 'es-CL',
  localePath: typeof window === 'undefined'
    ? path.resolve('.', 'public', 'locales')
    : '/locales',
  reloadOnPrerender: devMode,
  strictMode: true,
  react: { useSuspense: false }
}

module.exports = nextI18NextConfig
