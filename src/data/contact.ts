import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

type ContactFragment = {
  icon: IconDefinition
  linkPrefix?: string
  link?: string
  text?: Array<string> | string
}

type LocationFragment = {
  icon: string
  link: string
  text: Array<string>
}

export const contactData: Array<ContactFragment> = [
  {
    icon: faLinkedin,
    text: 'Stratego Tech',
    link: 'https://www.linkedin.com/company/strategotech/',
  },
  {
    icon: faEnvelope,
    text: 'contact@stratego.cl',
    linkPrefix: 'mailto',
  },
  {
    icon: faPhone,
    linkPrefix: 'tel',
    text: '+56 9 9942 0188',
  },
]

export const locationData: Array<LocationFragment> = [
  {
    icon: '🇨🇱',
    text: [
      'El Bosque Norte 0440',
      'Oficina 1401',
      'Las Condes, Santiago',
      'Chile',
    ],
    link: 'https://maps.app.goo.gl/VzbwahrMFGpU9u1FA',
  },
  {
    icon: '🇦🇷',
    text: [
      'Avenida Corrientes 311',
      'C1043',
      'Ciudad. Autónoma de Buenos Aires',
      'Argentina​',
    ],
    link: 'https://maps.app.goo.gl/vZhdMhAJytc4z3bQ8',
  },
]
