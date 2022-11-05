import 'react-i18next'

import type common from '../public/locales/es-CL/common.json'
import type sections from '../public/locales/es-CL/sections.json'

interface I18nNamespaces {
    common: typeof common
    sections: typeof sections
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nNamespaces
  }
}
