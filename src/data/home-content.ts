import { faBug } from '@fortawesome/free-solid-svg-icons/faBug'
import { faCloudBolt } from '@fortawesome/free-solid-svg-icons/faCloudBolt'
import { faFileShield } from '@fortawesome/free-solid-svg-icons/faFileShield'
import { faSignsPost } from '@fortawesome/free-solid-svg-icons/faSignsPost'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons/faUserSecret'
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield'

export const services = [
  {
    icon: faBug,
    title: 'sections:home.fragments.services.items.malwareSecurity.title',
    description:
      'sections:home.fragments.services.items.malwareSecurity.description',
  },
  {
    icon: faFileShield,
    title: 'sections:home.fragments.services.items.dataSecurity.title',
    description:
      'sections:home.fragments.services.items.dataSecurity.description',
  },
  {
    icon: faCloudBolt,
    title: 'sections:home.fragments.services.items.cloudSecurity.title',
    description:
      'sections:home.fragments.services.items.cloudSecurity.description',
  },
  {
    icon: faUserSecret,
    title: 'sections:home.fragments.services.items.webSecurity.title',
    description:
      'sections:home.fragments.services.items.webSecurity.description',
  },
  {
    icon: faUserShield,
    title: 'sections:home.fragments.services.items.databaseSecurity.title',
    description:
      'sections:home.fragments.services.items.databaseSecurity.description',
  },
  {
    icon: faSignsPost,
    title: 'sections:home.fragments.services.items.planning.title',
    description: 'sections:home.fragments.services.items.planning.description',
  },
]
