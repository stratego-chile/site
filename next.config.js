const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  distDir: 'build',
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  webpack: (config, _options) => {
    config.resolve.alias['@stratego'] = path.join(__dirname, 'src')
    return config
  },
}

module.exports = nextConfig
