export const DEFAULT_ASSETS_SOURCE = process.env.DEFAULT_ASSETS_SOURCE

export const getAssetPath = (
  resourceName: string,
  source = DEFAULT_ASSETS_SOURCE
) => source.concat(resourceName)
