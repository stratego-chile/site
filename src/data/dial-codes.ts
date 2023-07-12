import CountriesDialCodesData from '@stratego/data/countries-dial-codes.json'

type CountryDialCodesSpec = [
  name: string,
  iso2: string,
  dialCode: string,
  priority: number | undefined,
  areaCodes: Array<string> | undefined,
]

const countriesDialCodes = CountriesDialCodesData as Array<CountryDialCodesSpec>

const dialCodeSpecs = countriesDialCodes.map(
  ([name, iso2, dialCode, priority, areaCodes]) => ({
    name,
    iso2,
    dialCode,
    priority,
    areaCodes,
  })
)

export type DialCodeSpec = UnpackedArray<typeof dialCodeSpecs>

export default dialCodeSpecs
