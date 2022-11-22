import Layout from '@stratego/components/utils/layout'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import HomeStyles from '@stratego/styles/modules/Home.module.sass'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locale.middleware'

const Home: NextPage = () => {
  const [visibleUnderscore, setUnderscoreVisibility] = useState<boolean>()

  const { t } = useTranslation(['common'])

  useEffect(() => {
    const interval = setInterval(() => {
      setUnderscoreVisibility((state) => !state)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout
      pageTitle="Home"
      showNavigationOptions
      className={classNames(HomeStyles.wrapper, 'd-flex flex-column')}
      style={{ backgroundImage: `url('${getAssetPath('under-construction.gif')}')` }}
    >
      <div className={classNames(
          'd-inline-flex flex-grow-1 align-items-center justify-content-center',
          HomeStyles.title
        )}
      >
        <h1 className={classNames('fw-bold custom', HomeStyles.titleText)}>
          {capitalizeText(t('common:betaMessage'), 'simple')}
          <span className={classNames(!visibleUnderscore && 'invisible')}>_</span>
        </h1>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? defaultLocale, ['common', 'sections']),
  },
})

export default Home
