import SecurityLayout from '@stratego/components/utils/security-layout'
import { defaultLocale } from '@stratego/locales'
import { type NextPage, type GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { capitalizeText } from '@stratego/helpers/text.helper'
import ContactForm from '@stratego/components/forms/contact-form'

const Contact: NextPage<WithoutProps> = () => {
  const { t } = useTranslation('sections')

  return (
    <SecurityLayout
      title={[
        capitalizeText(t`sections:contact.title`, 'simple'),
        t`sections:security.brandDepartment`,
      ].join(' - ')}
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
    </SecurityLayout>
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
