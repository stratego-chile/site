import { defaultLocale } from '@stratego/locales'
import { StatusCodes } from 'http-status-codes'
import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'

const ErrorPage = dynamic(
  () => import('@stratego/components/shared/error-page')
)

const NotFoundPage: NextPage = () => {
  return <ErrorPage statusCode={StatusCodes.NOT_FOUND} />
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
