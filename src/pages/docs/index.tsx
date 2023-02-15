import { capitalizeText } from '@stratego/helpers/text.helper'
import { useAsyncMemo } from '@stratego/hooks/useAsyncMemo'
import { useStorage } from '@stratego/hooks/useStorage'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import classNames from 'classnames'
import { useFormik } from 'formik'
import type { GetStaticProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { type NextRouter, useRouter } from 'next/router'
import {
  Fragment,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
  type FC,
} from 'react'
import { Fade } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import * as yup from 'yup'

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
  router: NextRouter
  articles: Array<{
    id: string
    title: string
  }>
}

const ArticleLinks: FC<ArticleLinksProps> = ({ articles = [], router }) => {
  const { t } = useTranslation()

  return (
    <ListGroup as="ol" numbered>
      {articles.map(({ id, title }, key) => (
        <ListGroup.Item
          action
          as="li"
          className="pe-pointer text-start"
          key={key}
          onClick={() =>
            router.push(
              {
                pathname: `/docs/[post]`,
              },
              {
                pathname: `/docs/${id}`,
              },
              {
                shallow: true,
              }
            )
          }
        >
          {capitalizeText(t(title), 'simple')}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

const SEARCH_CRITERIA_DELAY = 1000

const Documentation: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const { t, i18n } = useTranslation()

  const { getStorageItem, setStorageItem } = useStorage()

  const formId = useId()

  const getControlId = useCallback(
    (controlRef: string) => formId.concat('-', controlRef),
    [formId]
  )

  const [foundArticles, setFoundArticles] = useState<
    Array<{
      id: string
      title: string
    }>
  >([])

  const [locallySavedArticles, setLocallySavedArticles] = useState<
    typeof foundArticles
  >([])

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

  const [delayedInputCriteria, setDelayedInputCriteria] = useState('')

  const [requestingResults, setRequestingState] = useState(false)

  const criteria = useDeferredValue(delayedInputCriteria)

  const searchResultsState = useMemo(
    () =>
      inputCriteria
        ? foundArticles.hasItems()
          ? SearchResultsDisplayMode.Found
          : SearchResultsDisplayMode.NotFound
        : SearchResultsDisplayMode.Blank,
    [inputCriteria, foundArticles]
  )

  const searchDocumentationPosts = async (
    searchCriteria: string,
    defaultMode?: boolean
  ) => {
    const response = await fetch('/api/search-docs', {
      method: 'POST',
      headers: {
        'Accept-Language': i18n.language,
      },
      body: JSON.stringify(
        defaultMode ? { default: true } : { searchCriteria }
      ),
    })

    const { foundArticles: $foundArticles } = await response.json()

    return $foundArticles instanceof Array ? $foundArticles : []
  }

  const { data: recommendedArticles } = useAsyncMemo<
    typeof foundArticles
  >(async () => {
    const fetchedArticles = await searchDocumentationPosts('', true)

    setStorageItem(locallySavedArticlesId, fetchedArticles)

    return fetchedArticles instanceof Array ? fetchedArticles : []
  }, [router.isReady, i18n.language])

  useEffect(() => {
    const $locallySavedArticles = getStorageItem(locallySavedArticlesId)

    if (
      $locallySavedArticles instanceof Array &&
      $locallySavedArticles.every(
        (article) =>
          article instanceof Object && 'id' in article && 'title' in article
      )
    )
      setLocallySavedArticles($locallySavedArticles)
  }, [getStorageItem])

  useEffect(() => {
    const searchCriteria = new URL(location.href).searchParams.get('search')
    if (searchCriteria)
      setValues(($values) => ({
        ...$values,
        inputCriteria: searchCriteria,
      }))
  }, [setValues])

  useEffect(() => {
    if (inputCriteria) {
      const searchTimeout = setTimeout(() => {
        setDelayedInputCriteria(inputCriteria)
      }, SEARCH_CRITERIA_DELAY)
      return () => clearTimeout(searchTimeout)
    }
  }, [inputCriteria])

  useEffect(() => {
    if (criteria && !requestingResults) {
      setRequestingState(true)
      searchDocumentationPosts(criteria)
        .then(($foundArticles) => {
          setFoundArticles($foundArticles)
        })
        .finally(() => setRequestingState(false))
    } else {
      setFoundArticles([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria])

  useEffect(() => {
    if (router.isReady) {
      const $router = router
      if (inputCriteria) $router.query.search = inputCriteria || undefined
      else if ('search' in $router.query) delete $router.query.search
      router.replace({
        query: $router.query,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCriteria])

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
              t={t}
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
            <ArticleLinks
              router={router}
              articles={
                recommendedArticles instanceof Array &&
                recommendedArticles.hasItems()
                  ? recommendedArticles
                  : locallySavedArticles
              }
            />
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
                  <ArticleLinks
                    router={router}
                    articles={
                      foundArticles instanceof Array ? foundArticles : []
                    }
                  />
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
