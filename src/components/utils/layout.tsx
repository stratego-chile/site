import {
  type FC,
  useEffect,
  useState,
  type PropsWithChildren,
  type DetailedHTMLProps,
  type HTMLAttributes,
  useMemo,
  useRef,
} from 'react'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import {
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_TITLE,
} from '@stratego/helpers/defaults.helper'
import NavBar, { type NavLinkSpec } from '@stratego/components/shared/navbar'
import Footer from '@stratego/components/shared/footer'
import { getPageTitle } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import Head from 'next/head'
import { useWindowScroll } from 'react-use'
import { motion } from 'framer-motion'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

export type LayoutProps = {
  pageTitle?: string
  pageDescription?: string
  brandDepartment?: string
  subLinks?: Array<NavLinkSpec>
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
  showReturnToTopButton: $showReturnToTopButton = true,
  children,
  ...divProps
}) => {
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()

  const { y: scrollPosition } = useWindowScroll()

  const showReturnToTopButtonRef = useRef<HTMLDivElement>(null)

  const showReturnToTopButton = useMemo(
    () =>
      typeof window !== 'undefined' &&
      $showReturnToTopButton &&
      scrollPosition > window.outerHeight * 0.6,
    [scrollPosition, $showReturnToTopButton]
  )

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
        theme="light"
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
      <motion.div
        ref={showReturnToTopButtonRef}
        animate={{ opacity: showReturnToTopButton ? 1 : 0 }}
        className={LayoutStyles.topTopButton}
      >
        <Button
          className="text-light rounded-pill"
          onClick={() =>
            document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </Button>
      </motion.div>
      <Footer />
    </div>
  )
}

export default Layout
