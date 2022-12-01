// @ts-check
/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === 'development',
  ns: ['common', 'sections'],
  defaultNS: 'common',
  i18n: {
    locales: ['es-CL', 'en-US', 'pt-BR'],
    defaultLocale: 'es-CL',
  },
  fallbackLng: 'es-CL',
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath: typeof window === 'undefined' ?
    require('path').resolve('.', 'public', 'locales') : '/locales',
  reloadOnPrerender: true,// process.env.NODE_ENV === 'development',
  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  strictMode: true,
  // serializeConfig: false,
  react: { useSuspense: false }
}
