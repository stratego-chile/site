import Layout from '@stratego/components/utils/layout'
import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import HomeStyles from '@stratego/styles/modules/Home.module.sass'
import { useAsyncMemo } from '@stratego/hooks/useAsyncMemo'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'

const backgroundImageSrc = getAssetPath('under-construction.gif')

const Home: NextPage = () => {
  const [visibleUnderscore, setUnderscoreVisibility] = useState<boolean>()

  const contentWrapperRef = useRef<HTMLDivElement>(null)

  const { data } = useAsyncMemo(async () => {
    return await fetch(backgroundImageSrc, {
      method: 'get',
      mode: 'cors',
    })
  }, [])

  const [backgroundImage, setBackgroundImage] = useState<string>()

  const handleBackgroundImageLoad = async (image: ReadableStream<Uint8Array>) => {
    if (!image.locked) {
      const { value } = await image.getReader().read()
      if (value) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(new Blob([value.buffer], { type: 'image/gif' }))
        fileReader.onload = () => {
          !backgroundImage && setBackgroundImage(fileReader.result as string)
        }
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setUnderscoreVisibility((state) => !state)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (data?.body) {
      const image = data.body as ReadableStream<Uint8Array>
      handleBackgroundImageLoad(image)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
          backgroundImage: typeof backgroundImage === 'string'
            ? `url('${backgroundImage}')`
            : undefined,
        }}
      >
        <div className={classNames(
          'd-flex position-sticky h-100 w-100 justify-content-center',
          HomeStyles.title
        )}>
          {typeof backgroundImage === 'string' && (
            <h1 className={classNames(
              'position-absolute top-50 fw-bold',
              HomeStyles.titleText
            )}>
              Site under construction
              <span className={classNames(!visibleUnderscore && 'invisible')}>_</span>
            </h1>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Home
