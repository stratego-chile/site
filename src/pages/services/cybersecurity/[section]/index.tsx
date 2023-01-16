import { type GetServerSideProps, type NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Layout from '@stratego/components/utils/layout'
import { cybersecurityLinks } from '@stratego/data/navigation-links'
import Container from 'react-bootstrap/Container'
import ErrorPage from '@stratego/components/utils/error-page'
import { useMemo } from 'react'
import { capitalizeText } from '@stratego/helpers/text.helper'
import dynamic from 'next/dynamic'

const AuditSection = dynamic(
  () => import('@stratego/pages/services/cybersecurity/[section]/(audit)')
)

const CybersecuritySection: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const {
    query: { section },
  } = router

  const { t } = useTranslation()

  const sections = useMemo(
    () => ({
      audit: () => <AuditSection />,
      // TODO: consulting: () => <Fragment></Fragment>,
    }),
    []
  )

  return String(section) in sections ? (
    <Layout
      pageTitle={capitalizeText(
        [t`sections:security.brandDepartment`].join('-'.surround(' ')),
        'simple'
      )}
      brandDepartment={t`sections:security.brandDepartment` satisfies string}
      subLinks={cybersecurityLinks.map(({ text, ...linkProps }) => ({
        text: t(text),
        ...linkProps,
      }))}
      showNavigationOptions
    >
      <Container className="my-5">
        {sections[String(section) as keyof typeof sections]()}
      </Container>
    </Layout>
  ) : (
    <ErrorPage statusCode={404} showGoBackButton />
  )
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, [
      'common',
      'sections',
    ])),
  },
})

export default CybersecuritySection
