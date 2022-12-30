const path = require('path')
const { i18n } = require('./next-i18next.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    ...i18n,
    // locales: ['default', 'es-CL', 'en-US', 'pt-BR'],
    // defaultLocale: 'default',
  },
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  webpack: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@stratego': path.join(__dirname, 'src'),
        }
      },
      plugins: [
        ...config.plugins,
      ],
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.pug$/,
            loader: '@webdiscus/pug-loader',
            options: {
              method: 'compile',
              embedFilters: {
                escape: true,
                markdown: true,
              },
            },
          },
        ]
      }
    }
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ]
  },
  // Add environment variables to the client
  env: {
    BRAND_NAME: process.env.BRAND_NAME,
    BRAND_JURIDICAL_NAME: process.env.BRAND_JURIDICAL_NAME,
    DEFAULT_PAGE_TITLE: process.env.DEFAULT_PAGE_TITLE,
    DEFAULT_PAGE_DESCRIPTION: process.env.DEFAULT_PAGE_DESCRIPTION,
    DEFAULT_ASSETS_SOURCE: process.env.DEFAULT_ASSETS_SOURCE,
    PAGES_TEMPLATES_SOURCE: process.env.PAGES_TEMPLATES_SOURCE,
    CAPTCHA_KEY: process.env.CAPTCHA_KEY,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
