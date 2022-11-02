import Layout from '@stratego/components/utils/layout'
import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import HomeStyles from '@stratego/styles/modules/Home.module.sass'

const Home: NextPage = () => {
  const [visibleUnderscore, setUnderscoreVisibility] = useState<boolean>()

  const contentWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setUnderscoreVisibility((state) => !state)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout pageTitle='Home'>
      <div
        ref={contentWrapperRef}
        className={classNames(
          'd-flex justify-content-center',
          HomeStyles.wrapper
        )}
        style={{
          height: contentWrapperRef.current?.parentElement?.clientHeight,
          backgroundImage: `url('/assets/animated/under-construction.gif')`,
        }}
      >
        <div className={classNames(
          'd-flex position-sticky h-100 w-100 justify-content-center',
          HomeStyles.title
        )}>
          <h1 className="position-absolute top-50 fw-bold">
            Site under construction
            <span className={classNames(!visibleUnderscore && 'invisible')}>_</span>
          </h1>
        </div>
      </div>
    </Layout>
  )
}

export default Home
