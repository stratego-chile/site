import Layout from '@stratego/components/utils/layout'
import { type PropsWithChildren, type FC } from 'react'
import { useTranslation } from 'next-i18next'
import SecurityLayoutStyles from '@stratego/styles/modules/SecurityLayout.module.sass'

type SecurityLayoutProps = {
  title?: string
}

const SecurityLayout: FC<PropsWithChildren<SecurityLayoutProps>> = ({ title, children }) => {
  const { t } = useTranslation(['sections'])

  return (
    <Layout
      pageTitle={title}
      brandDepartment={t('sections:security.brandDepartment')}
      subLinks={[
        {
          href: '/security/overview',
          text: t('sections:security.pages.overview.title')
        },
        {
          href: '/security/services',
          text: t('sections:security.pages.services.title')
        },
        {
          href: '/security/contact',
          text: t('sections:security.pages.contact.title')
        }
      ]}
      showNavigationOptions
      className={SecurityLayoutStyles.markdownContainer}
    >
      {children}
    </Layout>
  )
}

export default SecurityLayout
