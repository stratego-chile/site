import CountriesDialCodesData from '@stratego/data/countries-dial-codes.json'

type CountryDialCodesSpec =
  | [string, string, string]
  | [string, string, string, number]
  | [string, string, string, number, Array<string>]

const countries = CountriesDialCodesData as Array<CountryDialCodesSpec>

const dialCodeSpecs = countries.map(
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
