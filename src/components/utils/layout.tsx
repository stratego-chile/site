import { FC, useEffect, useState, PropsWithChildren } from 'react'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { Col, Container, Row } from 'react-bootstrap'
import Head from 'next/head'
import { DEFAULT_PAGE_DESCRIPTION, DEFAULT_TITLE } from '@stratego/helpers/defaults.helpers'
import NavBar from '@stratego/components/shared/navbar'
import Footer from '@stratego/components/shared/footer'
import { getPageTitle } from '@stratego/helpers/text.helper'
import classNames from 'classnames'

export type LayoutProps = {
  pageTitle?: string
  pageDescription?: string
  useBasicGrid?: boolean
}

const Layout: FC<PropsWithChildren<LayoutProps>> = (props) => {

  const { pageTitle, pageDescription, useBasicGrid, children } = props

  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()

  useEffect(() => {
    setTitle(pageTitle ? getPageTitle(pageTitle) : DEFAULT_TITLE)
  }, [pageTitle])

  useEffect(() => {
    setDescription(pageDescription ? pageDescription : DEFAULT_PAGE_DESCRIPTION)
  }, [pageDescription])

  return (
    <div className={classNames(LayoutStyles.pageContainer)}>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff9708" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#ffffff"/>
        <link rel="manifest" href="/manifest.json" />
        <title>{ title }</title>
        <meta name="description" content={ description } />
      </Head>
      <NavBar />
      <div className={classNames(LayoutStyles.pageContent)}>
        {
          useBasicGrid ?
            <Container>
              <Row>
                <Col>
                  { children }
                </Col>
              </Row>
            </Container> :
            children
        }
      </div>
      <Footer />
    </div>
  )
}

export default Layout
