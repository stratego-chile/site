import { useTranslation } from 'next-i18next'
import classNames from 'classnames'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import {
  type FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import kebabcase from '@stdlib/string/kebabcase'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'

type SectionLayoutProps = {
  section: 'audit' | 'consulting'
}

const SectionLayout: FC<SectionLayoutProps> = ({ section }) => {
  const router = useRouter()

  const { t } = useTranslation()

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
    const subsection = new URL(location.href).searchParams.get('subsection')
    if (subsection) {
      const index = subsections.findIndex(
        (subsectionName) =>
          kebabcase(subsectionName).toLowerCase() === subsection.toLowerCase()
      )
      setActiveSubsections([index])
    }
  }, [subsections])

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
    <Fragment>
      <Container className="my-5">
        <Row>
          <Col>
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
                {subsections.map((subsection, key) => (
                  <Accordion.Item key={key} eventKey={String(key)}>
                    <Accordion.Header
                      onClick={(event) =>
                        event.isTrusted && updateOpenedSubsections(key)
                      }
                    >
                      {t(
                        `sections:security.services.${section}.modules.${subsection}.title`
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
                          `sections:security.services.${section}.modules.${subsection}.description`,
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
    </Fragment>
  )
}

export default SectionLayout
