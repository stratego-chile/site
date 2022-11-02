const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  webpack5: false,
  webpack: (config) => {
    config.resolve.alias['@stratego'] = path.join(__dirname, 'src')
    return config
  },
}

module.exports = nextConfig
