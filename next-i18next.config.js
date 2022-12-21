// @ts-check
/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  ns: ['common', 'sections'],
  defaultNS: 'common',
  i18n: {
    /**
     * @type {Array<AvailableLocales>}
     */
    locales: ['es-CL', 'en-US', 'pt-BR'],
    /**
     * @type {AvailableLocales}
     */
    defaultLocale: 'es-CL',
  },
  /**
   * @type {AvailableLocales}
   */
  fallbackLng: 'es-CL',
  localePath: typeof window === 'undefined' ?
    require('path').resolve('.', 'public', 'locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  strictMode: true,
  react: { useSuspense: false }
}
