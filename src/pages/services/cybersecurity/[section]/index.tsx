import { type GetServerSideProps, type NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Layout from '@stratego/components/shared/layout'
import { cybersecurityLinks } from '@stratego/data/navigation-links'
import { useMemo } from 'react'
import { capitalizeText } from '@stratego/helpers/text.helper'
import dynamic from 'next/dynamic'
import LoadingPlaceholder from '@stratego/components/shared/loading-placeholder'

const ErrorPage = dynamic(
  () => import('@stratego/components/shared/error-page'),
  {
    loading: ({ isLoading, error }) => (
      <LoadingPlaceholder loading={isLoading} error={error} />
    ),
  }
)

const SectionLayout = dynamic(
  () => import('@stratego/pages/services/cybersecurity/[section]/(layout)'),
  {
    loading: ({ isLoading, error }) => (
      <LoadingPlaceholder loading={isLoading} error={error} />
    ),
  }
)

const CybersecuritySection: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const {
    query: { section },
  } = router

  const { t } = useTranslation()

  const sections = useMemo(
    () => ({
      audit: () => <SectionLayout section="audit" />,
      consulting: () => <SectionLayout section="consulting" />,
    }),
    []
  )

  const currentSection = useMemo(
    () =>
      (($currentSection) => $currentSection)(
        sections[String(section?.toString()) as keyof typeof sections]
      ),
    [sections, section]
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
      {currentSection && currentSection()}
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
