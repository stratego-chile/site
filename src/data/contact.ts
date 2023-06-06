import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

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
    text: ['Antonio Bellet 77', 'Oficina 1005', 'Providencia, Santiago, Chile'],
    link: 'https://goo.gl/maps/rtcBk3z9Pzx6rzVt9',
  },
]
