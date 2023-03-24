import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { Fragment } from 'react'
import { Image } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const AboutUs: NextPage<WithoutProps> = () => {
  const { t } = useTranslation('sections')

  return (
    <Layout
      className={LayoutStyles.autoFormat}
      pageTitle={capitalizeText(t`sections:aboutUs.title`, 'simple')}
      showNavigationOptions
    >
      <Container className="d-flex flex-column mb-5 gap-5 py-5">
        <Row className="justify-content-between align-items-center">
          {(
            t('sections:aboutUs.content', {
              returnObjects: true,
            }) as Array<{
              title: string
              images: Array<{
                path: string
                type: 'local' | 'external'
              }>
              description: Array<string>
            }>
          ).map(({ title, images, description }, key) => (
            <Fragment key={key}>
              <Col xs={12} className="pt-3">
                <h2 className="mb-4">{capitalizeText(title, 'simple')}</h2>
              </Col>
              {images instanceof Array &&
                images.map((image, imageKey) => (
                  <Col key={imageKey} xs={12} lg={5}>
                    <Image
                      className="d-inline-flex mt-5 mb-4"
                      src={
                        image.type === 'local'
                          ? image.path
                          : getAssetPath(image.path)
                      }
                      alt=""
                      style={{
                        width: '45rem',
                      }}
                      fluid
                    />
                  </Col>
                ))}
              <Col xs={12}>
                {description.map((paragraph, descriptionKey) => (
                  <p key={descriptionKey}>
                    {capitalizeText(paragraph, 'simple')}
                  </p>
                ))}
              </Col>
            </Fragment>
          ))}
        </Row>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<WithoutProps> = async ({
  locale,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, [
        'sections',
        'common',
      ])),
    },
  }
}

export default AboutUs
