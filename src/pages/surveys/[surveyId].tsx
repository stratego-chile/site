import Layout from '@stratego/components/shared/layout'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Script from 'next/script'
import { Col, Container, Row } from 'react-bootstrap'

const ALIAS_PREFIX = '__alias__'

/**
 * GoHighLevel-based surveys
 */
const surveys = {
  cyberSecurityChallenge: [
    [
      () => (
        <iframe
          src="https://api.leadconnectorhq.com/widget/survey/akZutFiFusFdEFRnOCwd"
          style={{
            border: 'none',
            minHeight: '85vh',
            height: 'auto',
            width: '100%',
            overflow: 'hidden',
          }}
          id="akZutFiFusFdEFRnOCwd"
          title="Desafios Ciberseguridad"
        />
      ),
      () => <Script defer src="https://link.msgsndr.com/js/form_embed.js" />,
    ],
    ['desafios-de-la-ciberseguridad'],
  ],
} satisfies {
  [id: string]: [elements: Array<() => JSX.Element>, equivalents: Array<string>]
}

const surveyIds = Object.entries(surveys).flatMap(([id, [, equivalents]]) =>
  [id, ...equivalents.map((_) => `${ALIAS_PREFIX}`.concat(_))].map(($id) =>
    encodeURIComponent($id)
  )
)

const resolveSurveyId = (id: string) => {
  const surveyId = surveyIds.find(($id) => $id.replace(ALIAS_PREFIX, '') === id)

  if (surveyId?.includes(ALIAS_PREFIX)) {
    return Object.entries(surveys)
      .find(([, [, equivalents]]) => {
        return equivalents.includes(surveyId.replace(ALIAS_PREFIX, ''))
      })
      ?.at(0) as keyof typeof surveys | undefined
  }

  return surveyId as keyof typeof surveys | undefined
}

type Props = {
  surveyId: string
}

export default function SurveyPage({ surveyId }: Props) {
  const resolvedId = resolveSurveyId(surveyId)

  const surveySpec = resolvedId ? surveys[resolvedId] : undefined

  if (!surveySpec)
    return (
      <Layout pageTitle="Encuestas" showNavigationOptions>
        <Container className="my-5">
          <Row className="mb-5">
            <Col className={LayoutStyles.autoFormat}>
              <p>Encuesta no encontrada</p>
            </Col>
          </Row>
        </Container>
      </Layout>
    )

  const [elements] = surveySpec

  return (
    <Layout pageTitle="Encuestas" showNavigationOptions>
      <Container className="my-5">
        <Row className="mb-5">
          <Col className={LayoutStyles.autoFormat}>
            {elements.map((element, index) => (
              <div key={index}>{element()}</div>
            ))}
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      ...surveyIds.map((surveyId) => ({
        locale: defaultLocale,
        params: {
          surveyId: surveyId.startsWith(ALIAS_PREFIX)
            ? surveyId.slice(7)
            : surveyId,
        },
      })),
    ],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  WithoutProps,
  {
    surveyId: string
  }
> = async ({ locale, params }) => {
  return {
    props: {
      surveyId: params!.surveyId,
      ...(await serverSideTranslations(locale ?? defaultLocale, [
        'common',
        'sections',
        'utils',
      ])),
    },
  }
}
