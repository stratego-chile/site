import Layout from '@stratego/components/shared/layout'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
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
    {
      title: 'Desafíos de la ciberseguridad',
      note: 'Te invitamos a responder esta breve encuesta',
      poweredBy: () => (
        <div className="d-flex justify-content-center">
          <Link
            className="d-inline-flex gap-3 align-items-center text-decoration-none text-body-secondary"
            href="https://www.bakertilly.cl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={200}
              height={50}
              alt="Bakertilly"
              src="/images/bakertilly-logo-black.svg"
            />
          </Link>
        </div>
      ),
    },
  ],
} satisfies {
  [id: string]: [
    elements: Array<() => JSX.Element>,
    equivalents: Array<string>,
    helpers: { title: string; note?: string; poweredBy?: () => JSX.Element },
  ]
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
      <Layout pageTitle="Encuesta no encontrada" showNavigationOptions>
        <Container className="my-5">
          <Row className="mb-5">
            <Col className={LayoutStyles.autoFormat}>
              <p>Encuesta no encontrada</p>
            </Col>
          </Row>
        </Container>
      </Layout>
    )

  const [elements, , { note, poweredBy: PoweredBy, title }] = surveySpec

  return (
    <Layout pageTitle="Encuesta" showNavigationOptions>
      <Container className="my-5">
        <Row className="mb-5">
          <Col className={LayoutStyles.autoFormat}>
            <h1>{title}</h1>

            <p>{note}</p>

            {elements.map((element, index) => (
              <div key={index}>{element()}</div>
            ))}

            {PoweredBy && <PoweredBy />}
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
            ? surveyId.replace(ALIAS_PREFIX, '')
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
