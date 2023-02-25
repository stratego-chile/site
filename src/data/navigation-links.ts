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

export const cybersecurityLinks: Array<LinkSpec> = [
  {
    text: 'sections:security.services.audit.title',
    subLinks: [
      {
        href: '/services/cybersecurity/audit',
        queryParams: {
          subsection: 'risks-and-vulnerabilities',
        },
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/audit',
        text: 'sections:security.services.audit.modules.risksAndVulnerabilities.title',
      },
      {
        href: '/services/cybersecurity/audit',
        queryParams: {
          subsection: 'infrastructure',
        },
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/audit',
        text: 'sections:security.services.audit.modules.infrastructure.title',
      },
      {
        href: '/services/cybersecurity/audit',
        queryParams: {
          subsection: 'procedures',
        },
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/audit',
        text: 'sections:security.services.audit.modules.procedures.title',
      },
      {
        href: '/services/cybersecurity/audit',
        queryParams: {
          subsection: 'mitigation',
        },
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/audit',
        text: 'sections:security.services.audit.modules.mitigation.title',
      },
      {
        href: '/services/cybersecurity/audit',
        queryParams: {
          subsection: 'social-engineering',
        },
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/audit',
        text: 'sections:security.services.audit.modules.socialEngineering.title',
      },
    ],
  },
  {
    text: 'sections:security.services.consulting.title',
    subLinks: [
      {
        href: '/services/cybersecurity/consulting',
        queryParams: {
          subsection: 'ISO-IEC27000',
        },
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/consulting',
        text: 'sections:security.services.consulting.modules.isoIec27000.title',
      },
      {
        href: '/services/cybersecurity/consulting',
        queryParams: {
          subsection: 'CHL21459',
        },
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/consulting',
        text: 'sections:security.services.consulting.modules.chl21459.title',
      },
    ],
  },
]

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
    text: 'sections:services.title',
    subLinks: [
      {
        text: 'sections:security.title',
        label: true,
        subLinks: cybersecurityLinks,
      },
    ],
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
  {
    text: 'sections:docs.title',
    href: '/docs',
  },
]
