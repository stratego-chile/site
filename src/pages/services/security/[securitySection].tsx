import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { type GetServerSideProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import { useMarkdownTemplate } from '@stratego/hooks/useMarkdownTemplate'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import SecurityLayout from '@stratego/components/utils/security-layout'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import camelcase from '@stdlib/string/camelcase'
import ErrorPage from '@stratego/components/utils/error-page'

const SecuritySection: NextPage<WithoutProps> = () => {
  const { query } = useRouter()

  const { securitySection } = query

  const { t, i18n } = useTranslation()

  const sections = useMemo(
    () => ({
      overview: {
        title: capitalizeText(
          t`sections:security.pages.overview.title`,
          'simple'
        ),
        template: `/${i18n.language}/security-services.mdx`,
      },
      learnMore: {
        title: capitalizeText(
          t`sections:security.pages.learnMore.title`,
          'simple'
        ),
        template: `/${i18n.language}/security-overview.mdx`,
      },
    }),
    [i18n, t]
  )

  const [isSectionDefined, currentSection] = useMemo(
    () =>
      ((found) => [
        found,
        found
          ? (camelcase(securitySection as string) as keyof typeof sections)
          : undefined,
      ])(
        typeof securitySection === 'string' &&
          Object.keys(sections).includes(camelcase(securitySection))
      ),
    [securitySection, sections]
  )

  const [content, checked] = useMarkdownTemplate(
    {
      templatePath:
        currentSection &&
        new URL(
          '/stratego-chile/site-content/'
            .concat(process.env.NODE_ENV === 'production' ? 'main' : 'dev')
            .concat('/docs/')
            .concat(sections[currentSection].template.replace(/\/*/i, '')),
          process.env.PAGES_TEMPLATES_SOURCE
        ),
      layoutParsers: {
        img: (props) => (
          <div className="my-5" style={{ height: '24rem' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                backgroundImage: `url(${props.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: 'inherit',
              }}
            />
          </div>
        ),
        a: ({ children, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer">
            {children}
            <sup>
              <FontAwesomeIcon icon={faUpRightFromSquare} size="sm" />
            </sup>
          </a>
        ),
      },
    },
    [currentSection]
  )

  return !isSectionDefined ? (
    checked ? (
      <ErrorPage statusCode={404} showGoBackButton={false} />
    ) : null
  ) : (
    <SecurityLayout
      title={[
        sections[currentSection!].title,
        t`sections:security.brandDepartment`,
      ].join(' - ')}
    >
      {isSectionDefined && content && checked && (
        <Container>
          <Row>
            <Col className="py-5">{content}</Col>
          </Row>
        </Container>
      )}
      {isSectionDefined && !content && !checked && (
        <Row className="d-flex flex-grow-1 align-content-center">
          <Col className="text-center">
            <Spinner />
          </Col>
        </Row>
      )}
    </SecurityLayout>
  )
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, [
      'common',
      'sections',
    ])),
  },
})

export default SecuritySection
