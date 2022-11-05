import Layout from '@stratego/components/utils/layout'
import { type PropsWithChildren, type FC } from 'react'
import { useTranslation } from 'next-i18next'

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
          href: '/security',
          text: t('sections:security.pages.overview.title')
        },
        {
          href: '/security/services',
          text: t('sections:security.pages.services.title')
        },
        {
          href: '/security/products',
          text: t('sections:security.pages.products.title')
        },
      ]}
      showNavigationOptions
      defaultGrid
    >
      {children}
    </Layout>
  )
}

export default SecurityLayout
