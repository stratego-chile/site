import kebabcase from '@stdlib/string/kebabcase'
import { cybersecurityLinks } from '@stratego/data/navigation-links'
import { isSimilar } from '@stratego/helpers/assert.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FC,
} from 'react'
import Accordion from 'react-bootstrap/Accordion'

type SectionLayoutProps = {
  section: SecuritySection
}

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const SubsectionItem = dynamic(
  () => import('@stratego/components/misc/service-subsection')
)

const Container = dynamic(() => import('react-bootstrap/Container'))

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

const SectionLayout: FC<SectionLayoutProps> = ({ section }) => {
  const router = useRouter()

  const [subsection, setSubsection] = useState<SecuritySection>()

  const [selectingSubsection, selectSubsection] = useTransition()

  const { t } = useTranslation()

  const bannerImage = useMemo(
    () =>
      t(`sections:security.services.${section}.image`, {
        returnObjects: true,
        defaultValue: '',
      }) as string,
    [section, t]
  )

  const [activeSubsections, setActiveSubsections] = useState<Array<string>>([])

  const subsections = useMemo(
    () =>
      Object.keys(
        t(`sections:security.services.${section}.modules`, {
          returnObjects: true,
        }) ?? {}
      ) ?? [],
    [section, t]
  )

  const toggleSubsection = useCallback(
    (eventKey: string) => {
      const $activeSubsections = [...activeSubsections]
      const activeSubsection = $activeSubsections.indexOf(String(eventKey))

      if (activeSubsection !== -1)
        $activeSubsections.splice(activeSubsection, 1)
      else $activeSubsections.push(String(eventKey))

      setActiveSubsections($activeSubsections)
    },
    [activeSubsections]
  )

  useEffect(() => {
    if (!selectingSubsection && subsection)
      selectSubsection(() => {
        const index = subsections.findIndex(($subsection) =>
          isSimilar(
            kebabcase($subsection).toLowerCase(),
            subsection.toLowerCase(),
            { syntheticPercentage: 100 }
          )
        )
        if (index >= 0) setActiveSubsections([String(index)])
        else setActiveSubsections(['0'])
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subsection, subsections])

  useEffect(() => {
    if (router.isReady) {
      const {
        query: { subsection: $subsection },
      } = router
      if ($subsection) {
        setSubsection($subsection.toString() as SecuritySection)
      }
    }
  }, [router, router.isReady])

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
            {subsections.hasItems && (
              <Accordion
                className="mt-5"
                activeKey={activeSubsections.map(($subsection) =>
                  String($subsection)
                )}
                alwaysOpen
              >
                {subsections.map(($subsection, key) => (
                  <SubsectionItem
                    key={key}
                    itemKey={String(key)}
                    scrollInto={activeSubsections.at(0) === String(key)}
                    section={section}
                    subsection={$subsection}
                    onSelection={toggleSubsection}
                  />
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
