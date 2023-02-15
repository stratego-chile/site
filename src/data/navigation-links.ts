export type LinkSpec = {
  text: string
  label?: boolean
  href?: string
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
        href: '/services/cybersecurity/audit?subsection=risks-and-vulnerabilities',
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/[section]',
        text: 'sections:security.services.audit.modules.risksAndVulnerabilities.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=infrastructure',
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/[section]',
        text: 'sections:security.services.audit.modules.infrastructure.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=procedures',
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/[section]',
        text: 'sections:security.services.audit.modules.procedures.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=mitigation',
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/[section]',
        text: 'sections:security.services.audit.modules.mitigation.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=social-engineering',
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/[section]',
        text: 'sections:security.services.audit.modules.socialEngineering.title',
      },
    ],
  },
  {
    text: 'sections:security.services.consulting.title',
    subLinks: [
      {
        href: '/services/cybersecurity/consulting?subsection=ISO-IEC27000',
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/[section]',
        text: 'sections:security.services.consulting.modules.isoIec27000.title',
      },
      {
        href: '/services/cybersecurity/consulting?subsection=CHL21459',
        dynamicPath: true,
        dynamicTemplatePath: '/services/cybersecurity/[section]',
        text: 'sections:security.services.consulting.modules.chl21459.title',
      },
    ],
  },
]
