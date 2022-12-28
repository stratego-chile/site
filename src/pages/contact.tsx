import ContactForm from '@stratego/components/forms/contact-form'
import Layout from '@stratego/components/utils/layout'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locale.middleware'
import { type GetServerSideProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Col, Container, Row } from 'react-bootstrap'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'

const Contact: NextPage<WithoutProps> = () => {
  const { t } = useTranslation()

  return (
    <Layout
      className={LayoutStyles.autoFormat}
      pageTitle={capitalizeText(t`sections:contact.title`, 'simple')}
      showNavigationOptions
    >
      <Container className="d-flex flex-column gap-5 mb-5 py-5">
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

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({
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
