import { type LinkSpec } from '@stratego/data/navigation-links'
import {
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_TITLE,
} from '@stratego/helpers/defaults.helper'
import { getPageTitle } from '@stratego/helpers/text.helper'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import PropTypes from 'prop-types'
import {
  useEffect,
  useState,
  type DetailedHTMLProps,
  type FC,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const NavBar = dynamic(() => import('@stratego/components/shared/navbar'))

const Footer = dynamic(() => import('@stratego/components/shared/footer'))

const ToTopButton = dynamic(
  () => import('@stratego/components/misc/to-top-button')
)

export type LayoutProps = {
  pageTitle?: string
  pageDescription?: string
  brandDepartment?: string
  subLinks?: Array<LinkSpec>
  defaultGrid?: boolean
  showNavigationOptions?: boolean
  showReturnToTopButton?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  pageTitle,
  pageDescription,
  brandDepartment,
  subLinks = [],
  defaultGrid,
  showNavigationOptions = false,
  showReturnToTopButton = true,
  children,
  ...divProps
}) => {
  const [title, setTitle] = useState<string>(process.env.DEFAULT_PAGE_TITLE)
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
        theme="dark-blue"
        brandDepartment={brandDepartment}
        subLinks={subLinks}
      />
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
              <Col>{children}</Col>
            </Row>
          </Container>
        ) : (
          children
        )}
      </div>
      <ToTopButton show={showReturnToTopButton} />
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  brandDepartment: PropTypes.string,
  subLinks: PropTypes.array,
  defaultGrid: PropTypes.bool,
  showNavigationOptions: PropTypes.bool,
  showReturnToTopButton: PropTypes.bool,
}

Layout.defaultProps = {
  subLinks: [],
  showNavigationOptions: false,
  showReturnToTopButton: true,
}

Layout.displayName = 'Layout'

export default Layout
