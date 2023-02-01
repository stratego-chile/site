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
  useTransition,
} from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import * as Yup from 'yup'
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

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

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
  const { t } = useTranslation()

  return (
    <ListGroup as="ol" numbered>
      {articles?.map(({ id, title }, key) => (
        <Link key={key} href={`/docs/${id}`} legacyBehavior passHref>
          <ListGroup.Item action as="li" className="pe-pointer">
            {capitalizeText(t(title), 'simple')}
          </ListGroup.Item>
        </Link>
      ))}
    </ListGroup>
  )
}

const Documentation: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const {
    query: { search },
  } = router

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
  >(async () => (await fetch('/api/default-docs')).json(), [i18n.language])

  const getControlId = useCallback(
    (controlRef: string) => formId.concat('-', controlRef),
    [formId]
  )

  const [requestingResults, requestResults] = useTransition()

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
    validationSchema: Yup.object().shape({
      criteria: Yup.string().required(),
    }),
  })

  const [delayedCriteria, setDelayedCriteria] = useState(inputCriteria)

  const criteria = useDeferredValue(delayedCriteria)

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
    if (search && !inputCriteria)
      setValues({
        inputCriteria: search.toString(),
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    const criteriaUpdateTimer = setTimeout(
      () => {
        setDelayedCriteria(inputCriteria)
      },
      !inputCriteria ? 0 : 1000
    )
    return () => clearTimeout(criteriaUpdateTimer)
  }, [inputCriteria, setValues])

  useEffect(() => {
    if (!criteria) return setFoundArticles([])
    else if (docsSearcher)
      requestResults(() => {
        docsSearcher('search-docs', criteria)
      })
  }, [criteria, docsSearcher])

  useEffect(() => {
    if (router.isReady)
      router.replace({
        query: inputCriteria
          ? {
              search: inputCriteria,
            }
          : {},
      })
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
                  className={classNames(
                    'd-flex',
                    requestingResults
                      ? 'justify-content-between'
                      : 'justify-content-end'
                  )}
                >
                  {requestingResults && <Spinner size="sm" />}
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
            <h6 className="my-4">Artículos recomendados</h6>
            <ArticleLinks articles={recommendedArticles ?? []} />
          </Col>
          <Col
            xs={12}
            lg
            className="align-self-stretch bg-light rounded-2 text-center"
          >
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
