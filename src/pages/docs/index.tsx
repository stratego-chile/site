import { capitalizeText } from '@stratego/helpers/text.helper'
import { useAsyncMemo } from '@stratego/hooks/use-async-memo'
import { useStorage } from '@stratego/hooks/use-storage'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import requester from 'axios'
import classNames from 'classnames'
import { useFormik } from 'formik'
import type { GetStaticProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Fragment,
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import Fade from 'react-bootstrap/Fade'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useAsyncFn } from 'react-use'

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const Container = dynamic(() => import('react-bootstrap/Container'))

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

const Badge = dynamic(() => import('react-bootstrap/Badge'))

const Spinner = dynamic(() => import('react-bootstrap/Spinner'))

const ArticleLinks = dynamic(
  () => import('@stratego/components/misc/docs-list')
)

const locallySavedArticlesId = 'recommendedArticles'

type DocumentationSearch = {
  inputCriteria: string
}

enum SearchResultsDisplayMode {
  Blank,
  NotFound,
  Found,
  Searching,
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
  })

  const [delayedInputCriteria, setDelayedInputCriteria] = useState('')

  const criteria = useDeferredValue(delayedInputCriteria)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const [documentationSearch, searchDocumentationPosts] = useAsyncFn(
    async <Mode extends boolean>(
      searchCriteria: string,
      defaultSearch?: Mode
    ) => {
      if (executeRecaptcha) {
        const captchaToken = await executeRecaptcha('enquiryFormSubmit')

        const response = await requester.post<
          Stratego.Common.ResponseBody<{
            foundArticles: Array<Stratego.Documentation.PostRef>
            defaultMode?: boolean
          }>
        >(
          '/api/docs/search',
          defaultSearch ? { default: true } : { searchCriteria },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Accept-Language': i18n.language,
              Authorization: captchaToken,
            },
          }
        )

        if (response.data.result) return response.data.result
      }
      return {
        foundArticles: [],
        defaultMode: defaultSearch,
      } as {
        foundArticles: Array<Stratego.Documentation.PostRef>
        defaultMode?: Mode
      }
    },
    [executeRecaptcha]
  )

  const [savedDefaultArticles, setSavedDefaultArticles] = useState<
    Array<Stratego.Documentation.PostRef>
  >([])

  const filterArticles = (
    assumedArticlesList: Array<any>
  ): Array<Stratego.Documentation.PostRef> => {
    return assumedArticlesList instanceof Array &&
      assumedArticlesList.hasItems &&
      assumedArticlesList.every(
        (article) =>
          article instanceof Object &&
          ['id', 'title', 'locale'].every(
            (expectedProp) => expectedProp in article
          )
      )
      ? assumedArticlesList
      : []
  }

  const { data: defaultArticles } = useAsyncMemo(async () => {
    const { foundArticles: $foundArticles = [] } =
      await searchDocumentationPosts('', true)

    console.log('defaultArticles:', $foundArticles)

    return filterArticles($foundArticles)
  }, [])

  const { data: foundArticles } = useAsyncMemo(async () => {
    if (inputCriteria !== criteria) return []

    const { foundArticles: $foundArticles } = (await searchDocumentationPosts(
      criteria
    )) ?? {
      foundArticles: [],
    }

    console.log('foundArticles:', $foundArticles)

    return filterArticles($foundArticles)
  }, [inputCriteria, criteria])

  const searchResultsState = useMemo(
    () =>
      documentationSearch.loading
        ? SearchResultsDisplayMode.Searching
        : inputCriteria
        ? foundArticles instanceof Array && foundArticles.hasItems
          ? SearchResultsDisplayMode.Found
          : SearchResultsDisplayMode.NotFound
        : SearchResultsDisplayMode.Blank,
    [documentationSearch.loading, inputCriteria, foundArticles]
  )

  useEffect(() => {
    const locallySavedArticles = getStorageItem(locallySavedArticlesId)

    if (
      locallySavedArticles instanceof Array &&
      locallySavedArticles.hasItems &&
      locallySavedArticles.every(
        (article) =>
          article instanceof Object &&
          ['id', 'title'].every((expectedProp) => expectedProp in article)
      )
    )
      setSavedDefaultArticles(locallySavedArticles)
  }, [getStorageItem])

  useEffect(() => {
    if (
      defaultArticles instanceof Array &&
      defaultArticles.hasItems &&
      defaultArticles.every(
        (article) =>
          article instanceof Object &&
          ['id', 'title', 'locale'].every(
            (expectedProp) => expectedProp in article
          )
      )
    )
      setStorageItem(locallySavedArticlesId, defaultArticles)
  }, [defaultArticles, setStorageItem])

  useEffect(() => {
    const searchCriteria = new URL(location.href).searchParams.get('search')
    if (searchCriteria)
      setValues(($values) => ({
        ...$values,
        inputCriteria: searchCriteria,
      }))
  }, [setValues])

  useEffect(() => {
    if (router.isReady) {
      const query = { ...router.query }

      if (inputCriteria)
        query.search = inputCriteria ? inputCriteria.trim() : undefined
      else if ('search' in query) delete query.search

      router.replace({ query }, undefined, { shallow: true })
    }
    if (inputCriteria) {
      const searchTimeout = setTimeout(() => {
        setDelayedInputCriteria(inputCriteria)
      }, SEARCH_CRITERIA_DELAY)
      return () => clearTimeout(searchTimeout)
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
                defaultArticles instanceof Array && defaultArticles.hasItems
                  ? defaultArticles
                  : savedDefaultArticles
              }
            />
          </Col>
          <Col
            xs={12}
            lg
            className={classNames(
              'align-self-stretch text-center',
              documentationSearch.loading &&
                'd-flex justify-content-center align-items-center'
            )}
          >
            {documentationSearch.loading && <Spinner size="sm" />}
            {!documentationSearch.loading &&
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
