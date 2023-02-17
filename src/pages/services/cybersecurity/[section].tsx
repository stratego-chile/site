import LoadingPlaceholder from '@stratego/components/shared/loading-placeholder'
import { defaultLocale } from '@stratego/locales'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useSearchParam } from 'react-use'

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
  () => import('@stratego/pages/services/cybersecurity/(layout)'),
  {
    loading: ({ isLoading, error }) => (
      <LoadingPlaceholder loading={isLoading} error={error} />
    ),
  }
)

const CybersecuritySection: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const sections: Array<Section> = ['audit', 'consulting']

  const subsection = useSearchParam('subsection')

  return (sections as Array<string>).includes(
    String(router.query.section).toLowerCase()
  ) ? (
    <Fragment>
      <SectionLayout
        section={router.query.section as Section}
        subsection={subsection ?? ''}
      />
    </Fragment>
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
