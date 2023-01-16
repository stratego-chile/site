'use client'
import { type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import classNames from 'classnames'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import kebabcase from '@stdlib/string/kebabcase'
import { useRouter } from 'next/router'

const AuditSection: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const { t } = useTranslation()

  const [activeSubsections, setActiveSubsections] = useState<Array<number>>([])

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

  const handleHashChange = useCallback(() => {
    const subsection = new URL(location.href).searchParams.get('subsection')
    if (subsection) {
      const index = subsections.findIndex(
        (subsectionName) => kebabcase(subsectionName) === subsection
      )
      setActiveSubsections([index])
    }
  }, [subsections])

  const updateOpenedSubsections = useCallback(
    (eventKey: number) => {
      const $openedSubsections = activeSubsections.slice()
      if ($openedSubsections.includes(eventKey)) {
        $openedSubsections.splice($openedSubsections.indexOf(eventKey), 1)
      } else {
        $openedSubsections.push(eventKey)
      }
      setActiveSubsections($openedSubsections)
    },
    [activeSubsections]
  )

  useEffect(() => {
    handleHashChange()
  }, [handleHashChange, router.asPath])

  return (
    <Fragment>
      <Row>
        <Col>
          <div className={classNames(LayoutStyles.autoFormat)}>
            <h1>{t`sections:security.services.audit.title`}</h1>
            {(
              t('sections:security.services.audit.description', {
                returnObjects: true,
              }) as Array<string>
            ).map((fragment, key) => (
              <p key={key}>{fragment}</p>
            ))}
          </div>
          {subsections.hasItems() && (
            <Accordion
              className="mt-5"
              activeKey={activeSubsections?.map(($subsection) =>
                String($subsection)
              )}
              alwaysOpen
            >
              {subsections.map((subsection, key) => (
                <Accordion.Item key={key} eventKey={String(key)}>
                  <Accordion.Header
                    onClick={() => updateOpenedSubsections(key)}
                  >
                    {t(
                      `sections:security.services.audit.modules.${subsection}.title`
                    )}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      {t(
                        `sections:security.services.audit.modules.${subsection}.description`
                      )}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Col>
      </Row>
    </Fragment>
  )
}

export default AuditSection
