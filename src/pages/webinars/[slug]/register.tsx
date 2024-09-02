import Layout from '@stratego/components/shared/layout'
import { defaultLocale } from '@stratego/locales'
import { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Webinars from '@stratego/data/webinars.json'
import { Col, Container, Row } from 'react-bootstrap'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { Fragment } from 'react'
import Script from 'next/script'

type Props = {
  webinar: (typeof Webinars)[number] | null
}

export default function Page({ webinar }: Props) {
  console.log('Found:', webinar ? webinar.title : 'nothing found')

  if (!webinar)
    return (
      <Layout pageTitle="Webinar no encontrado" showNavigationOptions>
        <Container className="my-5">
          <Row className="mb-5">
            <Col className={LayoutStyles.autoFormat}>
              <p>Ups, parece que este link no existe.</p>
            </Col>
          </Row>
        </Container>
      </Layout>
    )

  return (
    <Layout
      pageTitle={`Webinar - ${webinar.title}`}
      pageDescription={webinar.description}
      showNavigationOptions
    >
      <Container className="my-5">
        <Row>
          <Col>
            <h1 className="fw-bold">{webinar.title}</h1>

            {webinar.iframe.type === 'CRM' && (
              <Fragment>
                <iframe
                  src={webinar.iframe.src}
                  id={webinar.iframe.id}
                  style={{
                    border: 'none',
                    minHeight: '100%',
                    height: 'fit-content',
                    width: '100%',
                    overflow: 'hidden',
                  }}
                  title="Desafios Ciberseguridad"
                />

                <Script defer src="https://link.msgsndr.com/js/form_embed.js" />
              </Fragment>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const availableWebinarsSlugs = Webinars.flatMap(({ slugs }) => slugs)

  return {
    paths: availableWebinarsSlugs.map((slug) => ({
      locale: defaultLocale,
      params: {
        slug,
      },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  Props,
  {
    slug: string
  }
> = async ({ locale, params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, [
        'common',
        'sections',
      ])),
      webinar:
        Webinars.find(({ slugs }) =>
          slugs
            .map((slug) => slug.toLowerCase())
            .includes(String(params!.slug).toLowerCase())
        ) ?? null,
    },
  }
}
