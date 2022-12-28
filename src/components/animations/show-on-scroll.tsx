import { motion, useAnimation, useInView } from 'framer-motion'
import { type PropsWithChildren, useRef, type FC, useEffect } from 'react'

type ShowOnScrollProps = {
  direction?: 'left' | 'right' | 'top' | 'bottom'
  placementDiff?: number
  duration?: number
}

const ShowOnScroll: FC<PropsWithChildren<ShowOnScrollProps>> = ({
  children,
  direction = 'right',
  placementDiff = 25,
  duration = 0.8,
}) => {
  const controls = useAnimation()
  const rootRef = useRef<HTMLDivElement>(null)
  const onScreen = useInView(rootRef)

  const directions = {
    left: { x: placementDiff },
    right: { x: -placementDiff },
    top: { y: placementDiff },
    bottom: { y: -placementDiff },
  }

  useEffect(() => {
    if (onScreen) {
      controls.start({
        x: 0,
        opacity: 1,
        transition: {
          duration,
          ease: 'easeOut',
        },
      })
    }
  }, [onScreen, controls, duration])

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}

export default ShowOnScroll
