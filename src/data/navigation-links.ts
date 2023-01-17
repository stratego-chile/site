export type LinkSpec = {
  text: string
  label?: boolean
  href?: string
  subLinks?: Array<LinkSpec>
  disabled?: boolean
}

export const cybersecurityLinks: Array<LinkSpec> = [
  {
    text: 'sections:security.services.audit.title',
    subLinks: [
      {
        href: '/services/cybersecurity/audit?subsection=risks-and-vulnerabilities',
        text: 'sections:security.services.audit.modules.risksAndVulnerabilities.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=infrastructure',
        text: 'sections:security.services.audit.modules.infrastructure.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=procedures',
        text: 'sections:security.services.audit.modules.procedures.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=mitigation',
        text: 'sections:security.services.audit.modules.mitigation.title',
      },
      {
        href: '/services/cybersecurity/audit?subsection=social-engineering',
        text: 'sections:security.services.audit.modules.socialEngineering.title',
      },
    ],
  },
  {
    text: 'sections:security.services.consulting.title',
    subLinks: [
      {
        href: '/services/cybersecurity/consulting?subsection=ISO-IEC27000',
        text: 'sections:security.services.consulting.modules.isoIec27000.title',
      },
      {
        href: '/services/cybersecurity/consulting?subsection=CHL21459',
        text: 'sections:security.services.consulting.modules.chl21459.title',
      },
    ],
  },
]
