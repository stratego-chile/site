import ErrorPage from '@stratego/components/shared/error-page'
import { defaultLocale } from '@stratego/locales'
import { type GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const NotFoundPage = () => {
  return <ErrorPage statusCode={404} />
}

export const getStaticProps: GetStaticProps<WithoutProps> = async ({
  locale,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  }
}

export default NotFoundPage
