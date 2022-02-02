import Layout from '@stratego/components/utils/layout'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'

const Home: NextPage = () => {

  const [underscoreStyle, setUnderscoreStyle] = useState<string>()

  useEffect(() => {
    const interval = setInterval(() => {
      if (underscoreStyle?.includes('dark')) {
        setUnderscoreStyle('text-light')
      } else {
        setUnderscoreStyle('text-dark')
      }
    }, 600)
    return () => clearInterval(interval)
  }, [underscoreStyle])

  return (
    <Layout pageTitle='Home' useBasicGrid>
      <Image
        fluid
        className='d-block m-auto'
        src={'https://ecl-resources.s3.amazonaws.com/public/stratego/working-01.gif'}
        alt='Please visit us later' />
      <h1 className='text-center fw-bold'>
        Site under construction
        <span className={underscoreStyle}>_</span>
      </h1>
    </Layout>
  )
}

export default Home
