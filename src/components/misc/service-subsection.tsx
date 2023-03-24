import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from 'react'
import Accordion from 'react-bootstrap/Accordion'

type SectionLayoutProps = {
  section: string
  subsection: string
}

const SubsectionItem: React.FC<{
  itemKey: string
  scrollInto?: boolean
  section: SectionLayoutProps['section']
  subsection: SectionLayoutProps['subsection']
  onSelection: (key: string) => void
}> = ({ itemKey, section, subsection, onSelection }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const itemId = useId()

  const [scrolling, startScrolling] = useTransition()

  const [scrollable, setScrollable] = useState<boolean>(false)

  const { t } = useTranslation()

  const scrollIntoElement = useCallback(() => {
    contentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [contentRef])

  useEffect(() => {
    if (!scrolling && scrollable) {
      startScrolling(scrollIntoElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollable, subsection, scrollIntoElement])

  return (
    <Accordion.Item
      key={String(itemKey)}
      id={itemId} // Ensures the item is unique
      ref={contentRef}
      eventKey={String(itemKey)}
    >
      <Accordion.Header
        onClick={() => {
          onSelection(String(itemKey))
        }}
      >
        {t(`sections:security.services.${section}.modules.${subsection}.title`)}
      </Accordion.Header>
      <Accordion.Body onEntered={() => setScrollable(true)}>
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
  itemKey: PropTypes.string.isRequired,
  scrollInto: PropTypes.bool,
  section: PropTypes.string.isRequired,
  subsection: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
}

SubsectionItem.displayName = 'CybersecuritySubsectionItem'

export default SubsectionItem
