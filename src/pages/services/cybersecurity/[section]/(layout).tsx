import { useTranslation } from 'next-i18next'
import classNames from 'classnames'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import kebabcase from '@stdlib/string/kebabcase'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import { capitalizeText } from '@stratego/helpers/text.helper'
import dynamic from 'next/dynamic'
import { cybersecurityLinks } from '@stratego/data/navigation-links'

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

type SectionLayoutProps = {
  section: 'audit' | 'consulting'
}

const SectionLayout: FC<SectionLayoutProps> = ({ section }) => {
  const router = useRouter()

  const {
    query: { subsection },
  } = router

  const { t } = useTranslation()

  const bannerImage = useMemo(
    () =>
      t(`sections:security.services.${section}.image`, {
        returnObjects: true,
        defaultValue: '',
      }) as string,
    [section, t]
  )

  const [activeSubsections, setActiveSubsections] = useState<Array<number>>([])

  const subsections = useMemo(
    () =>
      Object.keys(
        t(`sections:security.services.${section}.modules`, {
          returnObjects: true,
        }) ?? {}
      ),
    [section, t]
  )

  const handleHashChange = useCallback(() => {
    if (subsection) {
      const index = subsections.findIndex(
        (subsectionName) =>
          kebabcase(subsectionName).toLowerCase() ===
          subsection.toString().toLowerCase()
      )
      setActiveSubsections([index])
    }
  }, [subsection, subsections])

  const updateOpenedSubsections = useCallback(
    (eventKey: number) => {
      const $activeSubsections = activeSubsections.slice()
      if ($activeSubsections.includes(eventKey))
        $activeSubsections.splice($activeSubsections.indexOf(eventKey), 1)
      else $activeSubsections.push(eventKey)
      setActiveSubsections($activeSubsections)
    },
    [activeSubsections]
  )

  useEffect(() => {
    handleHashChange()
  }, [handleHashChange, router.asPath])

  return (
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
    >
      <Container className={classNames(bannerImage ? 'mb-5' : 'my-5')}>
        <Row>
          <Col>
            {bannerImage && (
              <div
                className="d-none d-xl-block mb-5"
                style={{ height: '30rem' }}
                itemScope
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    backgroundImage: `url(${bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    width: '100%',
                    height: 'inherit',
                  }}
                />
              </div>
            )}
            <div className={classNames(LayoutStyles.autoFormat)}>
              <h1>{t(`sections:security.services.${section}.title`)}</h1>
              {((desc) =>
                desc instanceof Array ? (
                  desc.map((fragment, key) => <p key={key}>{fragment}</p>)
                ) : (
                  <p>{String(desc)}</p>
                ))(
                t(`sections:security.services.${section}.description`, {
                  returnObjects: true,
                })
              )}
            </div>
            {subsections.hasItems() && (
              <Accordion
                className="mt-5"
                activeKey={activeSubsections?.map(($subsection) =>
                  String($subsection)
                )}
                alwaysOpen
              >
                {subsections.map(($subsection, key) => (
                  <Accordion.Item key={key} eventKey={String(key)}>
                    <Accordion.Header
                      onClick={(event) =>
                        event.isTrusted && updateOpenedSubsections(key)
                      }
                    >
                      {t(
                        `sections:security.services.${section}.modules.${$subsection}.title`
                      )}
                    </Accordion.Header>
                    <Accordion.Body>
                      {((content) =>
                        content instanceof Array ? (
                          content.map((fragment, fragmentKey) => (
                            <p key={fragmentKey}>{fragment}</p>
                          ))
                        ) : (
                          <p>{content}</p>
                        ))(
                        t(
                          `sections:security.services.${section}.modules.${$subsection}.description`,
                          {
                            returnObjects: true,
                          }
                        )
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default SectionLayout
