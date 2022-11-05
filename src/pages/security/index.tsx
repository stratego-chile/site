import SecurityLayout from '@stratego/components/content/security/layout'
import { defaultLocale } from '@stratego/locale.middleware'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const SecurityIndex: NextPage = () => {
  const { t } = useTranslation(['sections'])

  return (
    <SecurityLayout
      title={[
        t('sections:security.pages.overview.title'),
        t('sections:security.brandDepartment')
      ].join(' - ')}
    ></SecurityLayout>
  )
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? defaultLocale, ['common', 'sections']),
  },
})

export default SecurityIndex
