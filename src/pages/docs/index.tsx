import { defaultLocale } from '@stratego/locales'
import { useFormik } from 'formik'
import { type GetStaticProps, type NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import {
  type FC,
  Fragment,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as yup from 'yup'
import { Trans, useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import Link from 'next/link'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { useAsyncMemo } from '@stratego/hooks/useAsyncMemo'
import { Fade } from 'react-bootstrap'
import { useTrigger } from '@harelpls/use-pusher'
import { isSerializable } from '@stratego/helpers/assert.helper'

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const locallySavedArticlesId = 'recommendedArticles'

type DocumentationSearch = {
  inputCriteria: string
}

enum SearchResultsDisplayMode {
  Blank,
  NotFound,
  Found,
}

type ArticleLinksProps = {
  articles: Array<{
    id: string
    title: string
  }>
}

const ArticleLinks: FC<ArticleLinksProps> = ({ articles }) => {
  const router = useRouter()

  const { t } = useTranslation()

  return (
    <ListGroup as="ol" numbered>
      {articles?.map(({ id, title }, key) => (
        <ListGroup.Item
          action
          as="li"
          className="pe-pointer"
          key={key}
          disabled={!router.isReady}
          onClick={() =>
            router.push('/docs/[post]', `/docs/${id}`, {
              shallow: true,
            })
          }
        >
          {capitalizeText(t(title), 'simple')}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

const Documentation: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const { t, i18n } = useTranslation()

  const formId = useId()

  const [foundArticles, setFoundArticles] = useState<
    Array<{
      id: string
      title: string
    }>
  >([])

  const { data: recommendedArticles } = useAsyncMemo<
    Array<UnpackedArray<typeof foundArticles>>
  >(async () => {
    if (window.localStorage) {
      const locallySavedArticles = localStorage.getItem(locallySavedArticlesId)
      if (locallySavedArticles && isSerializable(locallySavedArticles)) {
        const parsedArticles = JSON.parse(locallySavedArticles)
        if (parsedArticles instanceof Array) {
          let isCompat = true
          parsedArticles.forEach((article) => {
            if (
              !(Object.hasOwn(article, 'id') && Object.hasOwn(article, 'title'))
            )
              isCompat = false
          })
          if (isCompat) return parsedArticles
        }
      }
    }
    const fetchedArticles = await (await fetch('/api/default-docs')).json()
    if (window.localStorage)
      localStorage.setItem(
        locallySavedArticlesId,
        JSON.stringify(fetchedArticles)
      )
    return fetchedArticles
  }, [i18n.language])

  const getControlId = useCallback(
    (controlRef: string) => formId.concat('-', controlRef),
    [formId]
  )

  const [requestingResults, setRequestingState] = useState(false)

  const docsSearcher = useTrigger(process.env.DOCS_PUSHER_CHANNEL)

  const {
    errors,
    handleChange,
    handleSubmit,
    touched,
    values: { inputCriteria },
    resetForm,
    setValues,
  } = useFormik<DocumentationSearch>({
    initialValues: {
      inputCriteria: '',
    },
    enableReinitialize: true,
    onSubmit: () => void 0,
    validationSchema: yup.object({
      criteria: yup.string().nonNullable().required(),
    }),
  })

  const criteria = useDeferredValue(inputCriteria)

  const searchResultsState = useMemo(
    () =>
      criteria
        ? foundArticles.hasItems()
          ? SearchResultsDisplayMode.Found
          : SearchResultsDisplayMode.NotFound
        : SearchResultsDisplayMode.Blank,
    [criteria, foundArticles]
  )

  useEffect(() => {
    const searchCriteria = new URL(location.href).searchParams.get('search')
    if (searchCriteria)
      setValues(($values) => ({
        ...$values,
        inputCriteria: searchCriteria,
      }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (router.isReady) {
      if (inputCriteria) {
        router.query.search = inputCriteria || undefined
      } else if (Object.hasOwn(router.query, 'search')) {
        delete router.query.search
      }
      router.replace(router, router, {
        shallow: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCriteria])

  useEffect(() => {
    if (criteria && !requestingResults) {
      setRequestingState(true)
      docsSearcher('search-docs', criteria).finally(() =>
        setRequestingState(false)
      )
    } else {
      setFoundArticles([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria, docsSearcher])

  return (
    <Layout
      pageTitle={capitalizeText(
        t`sections:docs.title` satisfies string,
        'simple'
      )}
      showNavigationOptions
    >
      <Container className="d-flex flex-column flex-grow-1 my-5">
        <Row className="flex-grow-1 align-content-center gy-5">
          <Col xs={12} className={classNames(LayoutStyles.autoFormat)}>
            <Badge bg="warning" text="dark" pill className="fs-6">
              Beta
            </Badge>
            <span className="d-none d-lg-inline-block">&ensp;</span>
            <br className="d-lg-none mb-3" />
            <Trans
              i18nKey="sections:docs.previewAlert"
              components={{
                redirect: (
                  <Link
                    href="https://github.com/stratego-chile/site/issues"
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                ),
              }}
            />
            <br />
            <h1 className="mb-3">
              {capitalizeText(t`sections:docs.searchControl.title`, 'simple')}
            </h1>
          </Col>
          <Col xs={12} lg={5}>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                controlId={getControlId('searchCriteria')}
                className={LayoutStyles.inputWithButton}
              >
                <Form.Label>
                  {capitalizeText(
                    t`sections:docs.searchControl.label`,
                    'simple'
                  )}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="inputCriteria"
                  onChange={handleChange}
                  value={inputCriteria}
                  isInvalid={touched.inputCriteria && !!errors.inputCriteria}
                />
                <Form.Text
                  className={classNames('d-flex', 'justify-content-end')}
                >
                  <Fade in={!!inputCriteria}>
                    <Button
                      size="sm"
                      variant="link"
                      className={classNames(
                        'px-0',
                        !inputCriteria && 'pe-none'
                      )}
                      onClick={() => resetForm()}
                    >
                      {capitalizeText(
                        t`sections:docs.searchControl.resetButton`,
                        'simple'
                      )}
                    </Button>
                  </Fade>
                </Form.Text>
              </Form.Group>
            </Form>
            <h6 className="my-4">
              {t`sections:docs.recommendedArticles.title`}
            </h6>
            <ArticleLinks articles={recommendedArticles ?? []} />
          </Col>
          <Col
            xs={12}
            lg
            className={classNames(
              'align-self-stretch bg-light rounded-2 text-center',
              requestingResults &&
                'd-flex justify-content-center align-items-center'
            )}
          >
            {requestingResults && <Spinner size="sm" />}
            {!requestingResults &&
              (searchResultsState === SearchResultsDisplayMode.Found ? (
                <Fragment>
                  <h6 className="text-start">
                    {capitalizeText(t`sections:docs.messages.found`, 'simple')}
                  </h6>
                  <ArticleLinks articles={foundArticles ?? []} />
                </Fragment>
              ) : (
                <Row className="h-100 align-items-center">
                  <Col>
                    {searchResultsState === SearchResultsDisplayMode.Blank &&
                      !inputCriteria && (
                        <div>
                          {capitalizeText(
                            t`sections:docs.messages.welcome`,
                            'simple'
                          )}
                        </div>
                      )}
                    {searchResultsState ===
                      SearchResultsDisplayMode.NotFound && (
                      <div>
                        {capitalizeText(
                          t`sections:docs.messages.notFound`,
                          'simple'
                        )}
                      </div>
                    )}
                  </Col>
                </Row>
              ))}
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
      'docs',
    ])),
  },
})

export default Documentation
