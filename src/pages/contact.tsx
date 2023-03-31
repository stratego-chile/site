import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import type { ContainerProps } from 'react-bootstrap/Container'

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const Container = dynamic(
  () =>
    import('react-bootstrap/Container') as unknown as Promise<
      React.ComponentType<React.HTMLAttributes<HTMLElement> & ContainerProps>
    >
)

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

const ContactForm = dynamic(
  () => import('@stratego/components/forms/contact-form')
)

const Contact: NextPage<WithoutProps> = () => {
  const { t } = useTranslation()

  return (
    <Layout
      className={LayoutStyles.autoFormat}
      pageTitle={capitalizeText(t`sections:contact.title`, 'simple')}
      showNavigationOptions
    >
      <Container className="d-flex flex-column mb-5 gap-5 py-5">
        <Row>
          <Col>
            <h1>{capitalizeText(t`sections:contact.form.title`, 'simple')}</h1>
            <h6 className="fw-normal">
              {capitalizeText(t`sections:contact.form.subtitle`, 'simple')}
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <ContactForm />
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<WithoutProps> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, [
      'common',
      'sections',
      'validation',
    ])),
  },
})

export default Contact
