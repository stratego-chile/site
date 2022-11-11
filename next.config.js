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
    config.resolve.alias['@stratego'] = path.join(__dirname, 'src')
    return config
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
}

module.exports = nextConfig
