import { type GetServerSideProps, type NextPage } from 'next'
import { useRouter } from 'next/router'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import ErrorPage from '@stratego/components/utils/error-page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { useMarkdownTemplate } from '@stratego/hooks/useMarkdownTemplate'
import kebabcase from '@stdlib/string/kebabcase'
import LoadingPlaceholder from '@stratego/components/utils/loading-placeholder'
import dynamic from 'next/dynamic'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { capitalizeText } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import Link from 'next/link'

const GoBackButton = dynamic(
  () => import('@stratego/components/utils/go-back-button')
)

const Layout = dynamic(() => import('@stratego/components/utils/layout'), {
  loading: () => <LoadingPlaceholder />,
})

const DocumentationPost: NextPage<WithoutProps> = () => {
  const { t, i18n } = useTranslation()

  const {
    query: { post },
  } = useRouter()

  const [postContent, postFetchFinished, postFound] = useMarkdownTemplate(
    {
      templatePath:
        post &&
        String(process.env.DOCS_POSTS_SOURCE)
          .concat(`/${i18n.language}/`)
          .concat(kebabcase(post.toString()))
          .concat('.mdx'),
      layoutParsers: {
        img: (props) => (
          <div className="my-5" style={{ height: '30em' }} itemScope>
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
    [post, i18n]
  )

  return (
    <Layout
      pageTitle={capitalizeText(
        t`sections:docs.title` satisfies string,
        'simple'
      )}
      showNavigationOptions
    >
      {!postFetchFinished && <LoadingPlaceholder />}
      {postFetchFinished && postFound && (
        <Container className={classNames(LayoutStyles.autoFormat, 'my-5')}>
          <Row className="justify-content-end align-items-center">
            <Col xs="auto">
              <GoBackButton variant="link" />
            </Col>
          </Row>
          <Row>
            <Col>{postContent}</Col>
          </Row>
          <hr className="my-5" />
          <Row>
            <Col xs={12} lg>
              <small className="text-muted fst-italic">
                <Trans
                  t={t}
                  i18nKey="docs:page.helpNote"
                  components={{
                    redirect: (
                      <Link
                        href="https://github.com/stratego-chile/site-content/issues"
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                    ),
                  }}
                />
              </small>
            </Col>
          </Row>
        </Container>
      )}
      {postFetchFinished && !postFound && !postContent && (
        <Container className="d-flex flex-column flex-grow-1 my-5">
          <Row className="flex-grow-1 align-items-center justify-content-center">
            <Col>
              <ErrorPage statusCode={404} relativeHeight />
            </Col>
          </Row>
        </Container>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, [
      'common',
      'sections',
      'docs',
    ])),
  },
})

export default DocumentationPost
