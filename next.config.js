// @ts-check
const bundleAnalyzer = require('@next/bundle-analyzer')
const path = require('path')
const { i18n } =  require('./next-i18next.config.js')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
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
    BRAND_NAME: process.env.BRAND_NAME ?? '',
    BRAND_JURIDICAL_NAME: process.env.BRAND_JURIDICAL_NAME ?? '',
    DEFAULT_PAGE_TITLE: process.env.DEFAULT_PAGE_TITLE ?? '',
    DEFAULT_PAGE_DESCRIPTION: process.env.DEFAULT_PAGE_DESCRIPTION ?? '',
    DEFAULT_ASSETS_SOURCE: process.env.DEFAULT_ASSETS_SOURCE ?? '',
    DOCS_POSTS_SOURCE: process.env.DOCS_POSTS_SOURCE ?? '',
    CAPTCHA_KEY: process.env.CAPTCHA_KEY ?? '',
  },
}

module.exports = withBundleAnalyzer(nextConfig)
