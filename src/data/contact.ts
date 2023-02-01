import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faLocationDot,
  faPhone,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

type ContactFragment = {
  icon: IconDefinition
  linkPrefix?: string
  link?: string
  text?: Array<string> | string
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
    text: '+56 9 7793 4344',
  },
  {
    icon: faLocationDot,
    text: ['Padre Mariano 272', 'Oficina 302', 'Providencia, Santiago, Chile'],
    link: 'https://www.openstreetmap.org/way/579051556#map=19/-33.42477/-70.61791',
  },
]
