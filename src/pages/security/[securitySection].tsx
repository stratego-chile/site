import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { type GetServerSideProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locale.middleware'
import { useMarkdownTemplate } from '@stratego/hooks/useMarkdownTemplate'
import { Col, Container, Row, Spinner } from 'react-bootstrap'
import SecurityLayout from '@stratego/components/security-layout'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import ErrorPage from '@stratego/pages/_error'

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
        template: `/${i18n.language}/security-overview.mdx`,
      },
      services: {
        title: capitalizeText(
          t`sections:security.pages.services.title`,
          'simple'
        ),
        template: `/${i18n.language}/security-services.mdx`,
      },
    }),
    [i18n, t]
  )

  const [isSectionDefined, currentSection] = useMemo(
    () =>
      ((found) => [
        found,
        found ? (securitySection as keyof typeof sections) : undefined,
      ])(
        typeof securitySection === 'string' &&
          Object.keys(sections).includes(securitySection)
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
      <ErrorPage statusCode={404} />
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
