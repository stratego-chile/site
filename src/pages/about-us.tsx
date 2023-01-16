import Layout from '@stratego/components/utils/layout'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import { type GetStaticProps, type NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useTranslation } from 'next-i18next'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { Image } from 'react-bootstrap'
import classNames from 'classnames'
import { Fragment } from 'react'

const AboutUs: NextPage<WithoutProps> = () => {
  const { t } = useTranslation('sections')

  const images: Record<string, string | Array<string>> = {
    '1': 'bakertilly-logo-black.svg',
    '2': 'corfo-logo-blue.svg',
    '3': ['chrysalis-logo.png', 'chrysalis-pucv-logo.svg'],
  }

  return (
    <Layout
      className={LayoutStyles.autoFormat}
      pageTitle={capitalizeText(t`sections:aboutUs.title`, 'simple')}
      showNavigationOptions
    >
      <Container className="d-flex flex-column gap-5 mb-5 py-5">
        <Row className="justify-content-between align-items-center">
          {(
            t('sections:aboutUs.content', {
              returnObjects: true,
            }) as Array<{ title: string; description: Array<string> }>
          ).map(({ title, description }, key) => (
            <Fragment key={key}>
              {(($image) =>
                $image &&
                ($image instanceof Array ? (
                  $image.map((image, imageKey) => (
                    <Col key={imageKey} xs={12} lg={5}>
                      <Image
                        className="d-inline-flex mt-5 mb-4"
                        src={`/images/${image}`}
                        key={imageKey}
                        alt=""
                        style={{
                          width: '45rem',
                        }}
                        fluid
                      />
                    </Col>
                  ))
                ) : (
                  <Col xs={12} lg={5}>
                    <Image
                      className="d-inline-flex mt-5 mb-4"
                      src={`/images/${$image}`}
                      alt=""
                      style={{
                        width: '45rem',
                      }}
                      fluid
                    />
                  </Col>
                )))(images[String(key)])}
              <Col xs={12} className={classNames('d-flex flex-column py-3')}>
                <h2 className="mb-4">{capitalizeText(title, 'simple')}</h2>
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
