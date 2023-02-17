import kebabcase from '@stdlib/string/kebabcase'
import { cybersecurityLinks } from '@stratego/data/navigation-links'
import { isSimilar } from '@stratego/helpers/assert.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react'
import Accordion from 'react-bootstrap/Accordion'

type SectionLayoutProps = {
  section: string
  subsection: string
}

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const Container = dynamic(() => import('react-bootstrap/Container'))

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

const SubsectionItem: FC<{
  itemKey: number
  scrollInto?: boolean
  section: SectionLayoutProps['section']
  subsection: SectionLayoutProps['subsection']
  onSelection: (key: number) => void
}> = ({ itemKey, scrollInto, section, subsection, onSelection }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation()

  const scrollIntoElement = useCallback(() => {
    contentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [contentRef])

  if (scrollInto) {
    scrollIntoElement()
  }

  return (
    <Accordion.Item key={itemKey} eventKey={String(itemKey)}>
      <Accordion.Header
        onClick={() => {
          scrollIntoElement()
          onSelection(itemKey)
        }}
      >
        {t(`sections:security.services.${section}.modules.${subsection}.title`)}
      </Accordion.Header>
      <Accordion.Body ref={contentRef}>
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
  )
}

SubsectionItem.propTypes = {
  itemKey: PropTypes.number.isRequired,
  scrollInto: PropTypes.bool,
  section: PropTypes.string.isRequired,
  subsection: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
}

SubsectionItem.displayName = 'CybersecuritySubsectionItem'

const SectionLayout: FC<SectionLayoutProps> = ({ section, subsection }) => {
  const router = useRouter()

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
      ) ?? [],
    [section, t]
  )

  const handleHashChange = useCallback(() => {
    if (subsection) {
      const index = subsections.findIndex(($subsection) =>
        isSimilar(
          kebabcase($subsection).toLowerCase(),
          subsection.toLowerCase(),
          { syntheticPercentage: 95 }
        )
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
                activeKey={activeSubsections?.map(($subsection) =>
                  String($subsection)
                )}
                alwaysOpen
              >
                {subsections.map(($subsection, key) => (
                  <SubsectionItem
                    key={key}
                    itemKey={key}
                    scrollInto={activeSubsections.at(0) === key}
                    section={section}
                    subsection={$subsection}
                    onSelection={updateOpenedSubsections}
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
