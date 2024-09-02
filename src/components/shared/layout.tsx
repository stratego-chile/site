import type { LinkSpec } from '@stratego/data/navigation-links'
import {
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_TITLE,
} from '@stratego/helpers/defaults.helper'
import { getPageTitle } from '@stratego/helpers/text.helper'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
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
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
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

      <Alert variant="info" className="mb-0">
        <b>Webinar: Auditorías de Ciberseguridad en las Organizaciones</b>.{' '}
        Próximo 10 de septiembre, 9:00 a 10:00 AM (Santiago de Chile) y 10:00 a
        11:00 AM (Buenos Aires, Argentina). Regístre su asistencia{' '}
        <Link href="/webinars/auditoria-ciberseguridad-organizaciones/register">
          aquí
        </Link>
      </Alert>

      <Suspense>
        <NavBar
          showNavigationOptions={showNavigationOptions}
          theme="dark-blue"
          brandDepartment={brandDepartment}
          subLinks={subLinks}
        />
      </Suspense>

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

      <Suspense>
        <Footer />
      </Suspense>

      <Suspense>
        <ToTopButton show={showReturnToTopButton} />
      </Suspense>
    </div>
  )
}

Layout.displayName = 'Layout'

export default Layout
