import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faUpRightFromSquare'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import kebabcase from '@stdlib/string/kebabcase'
import LoadingPlaceholder from '@stratego/components/shared/loading-placeholder'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { useAsyncMemo } from '@stratego/hooks/use-async-memo'
import { useMarkdownTemplate } from '@stratego/hooks/use-markdown-template'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import requester from 'axios'
import classNames from 'classnames'
import { StatusCodes } from 'http-status-codes'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import type { ContainerProps } from 'react-bootstrap/Container'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useAsyncFn } from 'react-use'

const Layout = dynamic(() => import('@stratego/components/shared/layout'), {
  loading: () => <LoadingPlaceholder />,
})

const Container = dynamic(
  () =>
    import('react-bootstrap/Container') as unknown as Promise<
      React.ComponentType<React.HTMLAttributes<HTMLElement> & ContainerProps>
    >
)

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

const GoBackButton = dynamic(
  () => import('@stratego/components/shared/go-back-button')
)

const ErrorPage = dynamic(
  () => import('@stratego/components/shared/error-page')
)

const DocumentationPost: NextPage<WithoutProps> = () => {
  const { t, i18n } = useTranslation()

  const router = useRouter()

  const { executeRecaptcha } = useGoogleReCaptcha()

  const [refFetch, getDocRefData] = useAsyncFn(
    async (id: string) => {
      if (executeRecaptcha) {
        const captchaToken = await executeRecaptcha('enquiryFormSubmit')

        const response = await requester.get<
          Stratego.Common.ResponseBody<
            Stratego.Documentation.PostRef | undefined
          >
        >(`/api/docs/${id}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': i18n.language,
            Authorization: captchaToken,
          },
        })

        return response.data.result instanceof Object &&
          ['id', 'title', 'locale'].every(
            (expectedProp) => expectedProp in response.data.result!
          )
          ? (response.data.result as Stratego.Documentation.PostRef)
          : undefined
      }
      return undefined
    },
    [executeRecaptcha, i18n.language]
  )

  const { data: docRef } = useAsyncMemo(async () => {
    if (!router.query.post) return undefined
    const $docRef = await getDocRefData(router.query.post.toString())
    return $docRef
  }, [router.query.post, getDocRefData, i18n.language])

  const [postContent, fetchingPost, postFound] = useMarkdownTemplate(
    {
      templatePath:
        docRef &&
        String(process.env.DOCS_POSTS_SOURCE)
          .concat(`/${docRef.locale}/`)
          .concat(kebabcase(docRef.id ?? String(router.query.post?.toString())))
          .concat('.mdx'),
      components: {
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
    [docRef]
  )

  const fetching = useMemo(
    () => refFetch.loading || fetchingPost,
    [refFetch, fetchingPost]
  )

  return (
    <Layout
      pageTitle={capitalizeText(
        docRef?.title ?? (t`sections:docs.title` satisfies string),
        'simple'
      )}
      showNavigationOptions
      defaultGrid={!!fetching}
    >
      {fetching && <LoadingPlaceholder />}
      {!fetching && postFound && (
        <Container className={classNames(LayoutStyles.autoFormat, 'my-5')}>
          <Row className="justify-content-end align-items-center">
            <Col xs="auto">
              <GoBackButton variant="link" />
            </Col>
          </Row>
          <Row>
            <Col>{postContent}</Col>
          </Row>
          {postContent && (
            <Row>
              <Col xs={12}>
                <hr className="my-5" />
              </Col>
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
          )}
        </Container>
      )}
      {!fetching && !postFound && !postContent && (
        <Container className="d-flex flex-column flex-grow-1 my-5">
          <Row className="flex-grow-1 align-items-center justify-content-center">
            <Col>
              <ErrorPage statusCode={StatusCodes.NOT_FOUND} relativeHeight />
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
