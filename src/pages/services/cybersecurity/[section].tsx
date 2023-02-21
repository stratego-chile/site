import LoadingPlaceholder from '@stratego/components/shared/loading-placeholder'
import { defaultLocale, localesList } from '@stratego/locales
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const SectionLayout = dynamic(
  () => import('@stratego/components/misc/cybersecurity-section-layout'),
  {
    loading: ({ isLoading, error }) => (
      <LoadingPlaceholder loading={isLoading} error={error} />
    ),
  }
)

const CybersecuritySection: NextPage<WithoutProps> = () => {
  const router = useRouter()

  return <SectionLayout section={router.query.section as SecuritySection} />
}

export const getStaticPaths: GetStaticPaths<{
  section: SecuritySection
}> = async () => ({
  paths: Array.from(new Set<SecuritySection>(['audit', 'consulting']).values())
    .map((section) =>
      localesList.map((locale) => ({ params: { section }, locale }))
    )
    .flatMap((section) => section),
  fallback: false,
})

export const getStaticProps: GetStaticProps<WithoutProps> = async ({
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
