import { defaultLocale } from '@stratego/locales'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Webinars from '@stratego/data/webinars.json'
import Layout from '@stratego/components/shared/layout'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { formatInTimeZone } from 'date-fns-tz'

type Props = {
  webinars: typeof Webinars
}

export default function Page({ webinars }: Props) {
  return (
    <Layout
      pageTitle="Webinars"
      pageDescription="Conozca nuestros webinars"
      showNavigationOptions
    >
      <Container className="my-5">
        <Row>
          <Col>
            <h1 className="fw-bold">Webinars</h1>

            <div className="d-flex flex-column gap-4 mt-5">
              {webinars.map(({ description, slugs, title, time }, index) => (
                <div key={index} className="border rounded bg-light p-4">
                  <h2>{title}</h2>

                  <p>{description}</p>

                  <b>Horarios:</b>
                  {time.map(([start, end]) => (
                    <p key={start}>
                      {[
                        formatInTimeZone(
                          new Date(start),
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                          'dd-MM-yyyy'
                        ),
                        'de',
                        formatInTimeZone(
                          new Date(start),
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                          'HH:mm:ss'
                        ),
                        'a',
                        formatInTimeZone(
                          new Date(end),
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                          'HH:mm:ss'
                        ),
                        formatInTimeZone(
                          new Date(start),
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                          '(z zzzz)'
                        ),
                      ].join(' ')}
                    </p>
                  ))}

                  <Button
                    variant="primary"
                    className="fw-bold text-light"
                    href={`/webinars/${slugs[0]}/register`}
                  >
                    Registrarse
                  </Button>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<WithoutProps> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, [
      'common',
      'sections',
    ])),
    webinars: Webinars,
  },
})
