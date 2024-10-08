import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useMemo, useRef } from 'react'
import type { ButtonProps } from 'react-bootstrap/Button'
import { useWindowScroll } from 'react-use'

type ToTopButtonProps = {
  show?: boolean
}

const Button = dynamic(
  () =>
    import('react-bootstrap/Button') as unknown as Promise<
      React.ComponentType<React.HTMLAttributes<HTMLElement> & ButtonProps>
    >
)

const ToTopButton: React.FC<ToTopButtonProps> = ({ show = true }) => {
  const { y: scrollPosition } = useWindowScroll()

  const showReturnToTopButtonRef = useRef<HTMLDivElement>(null)

  const showReturnToTopButton = useMemo(
    () =>
      typeof window !== 'undefined' &&
      show &&
      scrollPosition > window.outerHeight * 0.6,
    [scrollPosition, show]
  )

  return (
    <motion.div
      ref={showReturnToTopButtonRef}
      animate={{ opacity: showReturnToTopButton ? 1 : 0 }}
      className={LayoutStyles.topTopButton}
    >
      <Button
        className="text-light rounded"
        onClick={() =>
          document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </Button>
    </motion.div>
  )
}

ToTopButton.displayName = 'ToTopButton'

export default ToTopButton
