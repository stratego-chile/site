import { type GetServerSideProps, type NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import LoadingPlaceholder from '@stratego/components/shared/loading-placeholder'

type Section = 'audit' | 'consulting'

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

  const sections: Array<Section> = ['audit', 'consulting']

  return sections.includes(String(section) as Section) ? (
    <SectionLayout section={section as Section} />
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
