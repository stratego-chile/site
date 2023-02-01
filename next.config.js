const path = require('path')
const { i18n } = require('./next-i18next.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    ...i18n,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    includePaths: [path.resolve(__dirname, 'src', 'styles')],
  },
  webpack: (config) => {
    config.resolve.alias['@stratego'] = path.join(__dirname, 'src')

    config.module.rules.push({
      test: /\.pug$/,
      loader: '@webdiscus/pug-loader',
      options: {
        method: 'compile',
        embedFilters: {
          escape: true,
          markdown: true,
        },
      },
    })

    return config
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
  // Add environment variables to the client side
  env: {
    BRAND_NAME: process.env.BRAND_NAME,
    BRAND_JURIDICAL_NAME: process.env.BRAND_JURIDICAL_NAME,
    DEFAULT_PAGE_TITLE: process.env.DEFAULT_PAGE_TITLE,
    DEFAULT_PAGE_DESCRIPTION: process.env.DEFAULT_PAGE_DESCRIPTION,
    DEFAULT_ASSETS_SOURCE: process.env.DEFAULT_ASSETS_SOURCE,
    DOCS_POSTS_SOURCE: process.env.DOCS_POSTS_SOURCE,
    DOCS_PUSHER_CHANNEL: process.env.DOCS_PUSHER_CHANNEL,
    CAPTCHA_KEY: process.env.CAPTCHA_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
