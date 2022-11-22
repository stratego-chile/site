const path = require('path')
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
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
        source: '/security',
        destination: '/security/overview',
        permanent: true,
      },
    ]
  },
  // Add environment variables to the client
  env: {
    PAGES_TEMPLATES_SOURCE: process.env.PAGES_TEMPLATES_SOURCE,
    CAPTCHA_KEY: process.env.CAPTCHA_KEY,
  },
}

module.exports = nextConfig
