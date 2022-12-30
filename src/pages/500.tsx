import { type GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import ErrorPage from '@stratego/components/utils/error-page'

const UnknownErrorPage = () => {
  return <ErrorPage statusCode={500} />
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  }
}

export default UnknownErrorPage
