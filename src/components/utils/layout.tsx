import {
  type FC,
  useEffect, 
  useState,
  type PropsWithChildren,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from 'react'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import { Col, Container, Row } from 'react-bootstrap'
import { DEFAULT_PAGE_DESCRIPTION, DEFAULT_TITLE } from '@stratego/helpers/defaults.helpers'
import NavBar from '@stratego/components/shared/navbar'
import Footer from '@stratego/components/shared/footer'
import { getPageTitle } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import Head from 'next/head'
import SubNavBar, { type Links } from '@stratego/components/shared/sub-navbar'

export type LayoutProps = {
  pageTitle?: string
  pageDescription?: string
  brandDepartment?: string
  subLinks?: Links
  defaultGrid?: boolean
  showNavigationOptions?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  pageTitle,
  pageDescription,
  brandDepartment,
  subLinks = [],
  defaultGrid,
  showNavigationOptions = false,
  children,
  ...divProps
}) => {
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
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <NavBar
        showNavigationOptions={showNavigationOptions}
        theme={subLinks.length > 0 ? 'dark' : 'light'}
        brandDepartment={brandDepartment}
      />
      {subLinks.length > 0 && <SubNavBar links={subLinks} />}
      <div
        {...divProps}
        className={classNames(
          LayoutStyles.pageContent,
          divProps.className,
          defaultGrid && 'py-5'
        )}
      >
        {defaultGrid ? (
          <Container>
            <Row>
              <Col>
                {children}
              </Col>
            </Row>
          </Container>
        ) : children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
