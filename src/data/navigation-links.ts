import type { ParsedUrlQueryInput } from 'querystring'

export type LinkSpec = {
  text: string
  label?: boolean
  href?: string
  queryParams?: ParsedUrlQueryInput
  subLinks?: Array<LinkSpec>
  disabled?: boolean
} & Exclusive<
  {
    dynamicPath: true
    dynamicTemplatePath: string
  },
  {
    dynamicPath?: false
    dynamicTemplatePath?: never
  }
>

export const navbarLinks: Array<LinkSpec> = [
  {
    text: 'sections:home.title',
    href: '/home',
  },
  {
    text: 'common:aboutUs',
    href: '/about-us',
  },
  {
    text: 'sections:utils.title',
    subLinks: [
      {
        text: 'sections:utils.list.0.title',
        href: '/utilities/password-generator',
      },
      {
        text: 'sections:utils.list.1.title',
        href: '/utilities/password-strength-checker',
      },
    ],
  },
  // TODO: Uncomment when the docs initial articles are ready
  // {
  //   text: 'sections:docs.title',
  //   href: '/docs',
  // },
]
