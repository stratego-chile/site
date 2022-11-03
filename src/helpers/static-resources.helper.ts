export const DEFAULT_ASSETS_SOURCE = 'https://stratego-public-assets.s3.amazonaws.com/landing/'

export const getAssetPath = (resourceName: string, source = DEFAULT_ASSETS_SOURCE) =>
  source.concat(resourceName)
