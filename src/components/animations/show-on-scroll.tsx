import { motion, useAnimation, useInView } from 'framer-motion'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

type ShowOnScrollProps = {
  direction?: 'left' | 'right' | 'top' | 'bottom'
  placementDiff?: number
  duration?: number
}

enum DisplayState {
  HIDDEN,
  SHOWN,
}

const ShowOnScroll: React.FC<React.PropsWithChildren<ShowOnScrollProps>> = ({
  children,
  direction = 'right',
  placementDiff = 45,
  duration = 0.8,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onScreen = useInView(wrapperRef)

  const controls = useAnimation()

  const [displayState, setDisplayState] = useState(DisplayState.HIDDEN)

  const directions = {
    left: { x: placementDiff },
    right: { x: -placementDiff },
    top: { y: placementDiff },
    bottom: { y: -placementDiff },
  }

  useEffect(() => {
    if (onScreen && displayState === DisplayState.HIDDEN)
      setDisplayState(DisplayState.SHOWN)
  }, [onScreen, displayState])

  useEffect(() => {
    // This prevent animation calculation for every render
    if (displayState === DisplayState.SHOWN)
      controls.start({
        x: 0,
        opacity: 1,
        transition: {
          duration,
          ease: 'easeOut',
        },
      })
  }, [displayState, controls, duration])

  return (
    <motion.div
      style={{
        position: 'inherit',
        display: 'inherit',
        height: '100%',
        overflow: 'visible',
        width: displayState ? '100%' : `calc(100% - ${placementDiff}px)`,
      }}
      ref={wrapperRef}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}

ShowOnScroll.propTypes = {
  direction: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  placementDiff: PropTypes.number,
  duration: PropTypes.number,
}

ShowOnScroll.defaultProps = {
  direction: 'right',
  placementDiff: 45,
  duration: 0.8,
}

ShowOnScroll.displayName = 'ShowOnScroll'

export default ShowOnScroll
