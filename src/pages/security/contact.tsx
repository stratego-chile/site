import SecurityLayout from '@stratego/components/content/security/layout'
import { defaultLocale } from '@stratego/locale.middleware'
import { type GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { getEmoji } from 'language-flag-colors'
import { useId, useMemo } from 'react'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { Field, Formik, type FormikHelpers, Form as FormikForm } from 'formik'
import dialCodes from '@stratego/data/dialCodes'
import * as yup from 'yup'

type ContactForm = {
  name: string
  surname: string
  phonePrefix: string
  phoneNumber: string
  businessName: string
  email: string
  message: string
}

const Contact = () => {
  const { t } = useTranslation('common')

  const nameId = useId()
  const surnameId = useId()
  const phoneNumberId = useId()
  const phoneNumberPrefixId = useId()
  const businessNameId = useId()
  const emailId = useId()
  const messageId = useId()

  const countryPhonePrefixes = useMemo(() => dialCodes, [])

  const validationSchema = yup.object().shape({
    name: yup.string().required('validation:required'),
    surname: yup.string().required('validation:required'),
    phonePrefix: yup.string().required('validation:required'),
    phoneNumber: yup.string().required('validation:required'),
    businessName: yup.string().required('validation:required'),
    email: yup.string().email('validation:email').required('validation:required'),
    message: yup.string().required('validation:required'),
  })

  const handleSubmission = (
    values: ContactForm,
    helpers: FormikHelpers<ContactForm>
  ) => {
    helpers.setSubmitting(true)
    console.log(values)
    helpers.setSubmitting(false)
  }

  return <SecurityLayout
    title={
      [
        capitalizeText(t('sections:security.pages.contact.title'), 'simple'),
        t('sections:security.brandDepartment')
      ].join(' - ')
    }
  >
    <Container className="d-flex flex-column gap-5 mb-5 py-5">
      <Row>
        <Col>
          <h1>Nos ponemos en contacto?</h1>
          <h6>
            Si tienes alguna duda o quieres contactar con nosotros, puedes hacerlo a través del siguiente formulario:
          </h6>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{
              name: '',
              surname: '',
              phonePrefix: '',
              phoneNumber: '',
              businessName: '',
              email: '',
              message: '',
            } as ContactForm}
            validationSchema={validationSchema}
            onSubmit={handleSubmission}
          >
            {({
              values,
              errors,
              isSubmitting,
              handleChange,
              handleSubmit
            }) => (
              <FormikForm onSubmit={handleSubmit}>
                <Row className="gy-4">
                  <Form.Group as={Col} xs={12} lg={6} controlId={nameId}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      as={Field}
                      type="text"
                      name="name"
                      handleChange={handleChange}
                      value={values.name}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name && capitalizeText(t(errors.name), 'simple')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} xs={12} lg={6} controlId={surnameId}>
                    <Form.Label>Surname</Form.Label>
                    <Form.Control
                      as={Field}
                      type="text"
                      name="surname"
                      handleChange={handleChange}
                      value={values.surname}
                      isInvalid={!!errors.surname}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.surname && capitalizeText(t(errors.surname), 'simple')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Col xs={12} lg>
                    <Form.Label>Phone prefix code</Form.Label>
                    <InputGroup>
                      <Form.Select
                        as={Field}
                        id={phoneNumberPrefixId}
                        name="phonePrefix"
                        onChange={handleChange}
                        value={values.phonePrefix}
                      >
                        {countryPhonePrefixes
                          .map((spec) => ({ ...spec, flag: getEmoji(spec.iso2)! }))
                          .filter(({ flag }) => flag)
                          .map(({ flag, dialCode, name }, key) => (
                            <option value={dialCode} key={key}>
                              {flag} {name} +{dialCode}
                            </option>
                          ))}
                      </Form.Select>
                      <Form.Control
                        as={Field}
                        type="tel"
                        id={phoneNumberId}
                        name="phoneNumber"
                        style={{ width: 'auto' }}
                        handleChange={handleChange}
                        value={values.phoneNumber}
                        isInvalid={!!errors.phoneNumber}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber && capitalizeText(t(errors.phoneNumber), 'simple')}
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={12} lg>
                    <Form.Group controlId={businessNameId}>
                      <Form.Label>Business name</Form.Label>
                      <Form.Control
                        as={Field}
                        type="text"
                        name="businessName"
                        handleChange={handleChange}
                        value={values.businessName}
                        isInvalid={!!errors.businessName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.businessName && capitalizeText(t(errors.businessName), 'simple')}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId={emailId}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        as={Field}
                        type="email"
                        name="email"
                        handleChange={handleChange}
                        value={values.email}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email && capitalizeText(t(errors.email), 'simple')}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId={messageId}>
                      <Form.Label>Short message</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        onChange={handleChange}
                        value={values.message}
                        isInvalid={!!errors.message}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.message && capitalizeText(t(errors.message), 'simple')}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="d-flex justify-content-end">
                    <Button type="submit" className="text-light" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner size="sm" /> : 'Send'}
                    </Button>
                  </Col>
                </Row>
              </FormikForm>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  </SecurityLayout>
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? defaultLocale, ['common', 'sections', 'validation']),
  },
})

export default Contact
