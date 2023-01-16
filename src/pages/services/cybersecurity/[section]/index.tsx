import { type GetServerSideProps, type NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Layout from '@stratego/components/utils/layout'
import classNames from 'classnames'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { cybersecurityLinks } from '@stratego/data/navigation-links'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ErrorPage from '@stratego/components/utils/error-page'
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { capitalizeText } from '@stratego/helpers/text.helper'
import kebabcase from '@stdlib/string/kebabcase'

const CybersecuritySection: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const {
    query: { section },
  } = router

  const { t } = useTranslation()

  const [activeSubsection, setActiveSubsection] = useState<number>()

  const subsections = useMemo(
    () =>
      Object.keys(
        t(
          'sections:security.services.audit.modules',
          {
            returnObjects: true,
          } ?? {}
        )
      ),
    [t]
  )

  const pageId = useId()

  const getElementId = useCallback(
    (refKey: string) => pageId.concat('-', refKey),
    [pageId]
  )

  const sections = useMemo(
    () => ({
      audit: () => (
        <Fragment>
          <Row>
            <Col>
              <h1>{t`sections:security.services.audit.title`}</h1>
              {(
                t('sections:security.services.audit.description', {
                  returnObjects: true,
                }) as Array<string>
              ).map((fragment, key) => (
                <p key={key}>{fragment}</p>
              ))}
              <Tabs
                fill
                className="mt-5"
                onSelect={(eventKey) =>
                  eventKey !== null && setActiveSubsection(Number(eventKey))
                }
                activeKey={String(activeSubsection)}
                id={getElementId('audit')}
              >
                {subsections.map((subsection, key) => (
                  <Tab
                    id={getElementId(`audit-${key}`)}
                    className="border border-top-0 rounded-bottom p-4"
                    title={
                      <span className="my-auto">
                        {t(
                          `sections:security.services.audit.modules.${subsection}.title`
                        )}
                      </span>
                    }
                    mountOnEnter
                    key={key}
                    eventKey={key}
                  >
                    <p>
                      {t(
                        `sections:security.services.audit.modules.${subsection}.description`
                      )}
                    </p>
                  </Tab>
                ))}
              </Tabs>
            </Col>
          </Row>
        </Fragment>
      ),
      // TODO: consulting: () => <Fragment></Fragment>,
    }),
    [activeSubsection, getElementId, subsections, t]
  )

  const handleHashChange = useCallback(() => {
    const subsection = new URL(location.href).searchParams.get('subsection')
    if (subsection !== null) {
      const index = subsections.findIndex(
        (subsectionName) => kebabcase(subsectionName) === subsection
      )
      setActiveSubsection(index)
    }
  }, [subsections])

  useEffect(() => {
    handleHashChange()
  }, [handleHashChange])

  useEffect(() => {
    if (typeof activeSubsection === 'number') {
      const currentSubsection = subsections.at(activeSubsection)
      if (currentSubsection) {
        const url = new URL(location.href)
        if (
          kebabcase(currentSubsection) !== url.searchParams.get('subsection')
        ) {
          url.searchParams.set('subsection', kebabcase(currentSubsection))
        }
      }
    }
  }, [activeSubsection, router, subsections])

  return String(section) in sections ? (
    <Layout
      pageTitle={capitalizeText(
        [t`sections:security.brandDepartment`].join('-'.surround(' ')),
        'simple'
      )}
      brandDepartment={t`sections:security.brandDepartment` satisfies string}
      subLinks={cybersecurityLinks.map(({ text, ...linkProps }) => ({
        text: t(text),
        ...linkProps,
      }))}
      showNavigationOptions
      className={classNames(LayoutStyles.autoFormat)}
    >
      <Container className="my-5">
        {sections[String(section) as keyof typeof sections]()}
      </Container>
    </Layout>
  ) : (
    <ErrorPage statusCode={404} showGoBackButton />
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

export default CybersecuritySection
