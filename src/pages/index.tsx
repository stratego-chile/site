import Layout from '@stratego/components/utils/layout'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import HomeStyles from '@stratego/styles/modules/Home.module.sass'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { Col, Row } from 'react-bootstrap'
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
      className={classNames('d-flex justify-content-center', HomeStyles.wrapper)}
      style={{ backgroundImage: `url('${getAssetPath('under-construction.gif')}')` }}
    >
      <Row className={classNames('align-self-stretch w-100')}>
        <Col className={classNames(
          'd-flex h-100 justify-content-center align-items-center',
          HomeStyles.title
        )}>
          <h1 className={classNames('fw-bold', HomeStyles.titleText)}>
            {capitalizeText(t('common:betaMessage'), 'simple')}
            <span className={classNames(!visibleUnderscore && 'invisible')}>_</span>
          </h1>
        </Col>
      </Row>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? defaultLocale, ['common', 'sections']),
  },
})

export default Home
