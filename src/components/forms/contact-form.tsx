import dialCodes from '@stratego/data/dialCodes'
import { capitalizeText, getCountryFlagEmoji } from '@stratego/helpers/text.helper'
import { type FormikHelpers, useFormik } from 'formik'
import { getCountryCode } from 'language-flag-colors'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Row, Form, Col, InputGroup, Button, Spinner, Alert } from 'react-bootstrap'
import emojiSupport from 'detect-emoji-support'
import requester from 'axios'
import * as yup from 'yup'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type ContactData = {
  name: string
  surname: string
  phonePrefix: string
  phoneNumber: string
  businessName: string
  email: string
  message: string
}

type ContactSubmitResponse =
  | { status: 'OK' }
  | {
    status: 'ERROR'
    message: string
    trace?: any
  }

const MAX_MESSAGE_LENGTH = 200

const ContactForm = () => {
  const { t, i18n } = useTranslation('sections')

  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  }>()

  const nameId = useId()
  const surnameId = useId()
  const phoneNumberId = useId()
  const phonePrefixId = useId()
  const businessNameId = useId()
  const emailId = useId()
  const messageId = useId()

  const countryPhonePrefixes = useMemo(() => dialCodes, [])

  const [supportEmojis, setEmojisSupport] = useState(false)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const validationSchema = yup.object().shape({
    name: yup.string().required('validation:required'),
    surname: yup.string().required('validation:required'),
    phonePrefix: yup.string().required('validation:required'),
    phoneNumber: yup.string().matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'validation:invalidPhoneNumber'
    ).required('validation:required'),
    businessName: yup.string().required('validation:required'),
    email: yup.string().email('validation:email').required('validation:required'),
    message: yup.string(),
  })

  const handleSubmission = useCallback(
    (values: ContactData, helpers: FormikHelpers<ContactData>) => {
      if (!executeRecaptcha) {
        return
      }

      executeRecaptcha('enquiryFormSubmit').then((captchaToken) => {
        helpers.setSubmitting(true)

        const $values: typeof values = {
          ...values,
          // Now we resolve the correct country phone dial code
          // according to the selected ISO 3166 alpha-2 code
          // This prevent the incorrect assignation of the flag
          phonePrefix: '+'.concat(
            countryPhonePrefixes.find(
              ({ iso2 }) => iso2 === values.phonePrefix
            )!.dialCode! // Assume that is always defined since the value is given by the same data array
          ),
        }

        requester
          .post<ContactSubmitResponse>('/api/contact', $values, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Accept-Language': i18n.language,
              Authorization: captchaToken,
            }
          })
          .then(({ data }) => {
            helpers.resetForm()
            setSubmitMessage({
              type: data.status === 'OK' ? 'success' : 'error',
              text: data.status === 'OK' ? 'sections:contact.form.messages.success' : 'error:submit',
            })
          })
          .catch((error) => {
            console.warn(error)
            setSubmitMessage({
              type: 'error',
              text: 'error:submit',
            })
          })
          .finally(() => {
            helpers.setSubmitting(false)
          })
      })
    },
  [countryPhonePrefixes, i18n.language, executeRecaptcha])

  const {
    values,
    errors,
    isSubmitting,
    setValues,
    touched,
    handleChange,
    handleSubmit,
  } = useFormik<ContactData>({
    initialValues: {
      name: '',
      surname: '',
      phonePrefix: '',
      phoneNumber: '',
      businessName: '',
      email: '',
      message: '',
    },
    validationSchema,
    onSubmit: handleSubmission
  })

  useEffect(() => {
    const $dialCodeCountryCode = countryPhonePrefixes.find(
      ({ iso2 }) => getCountryCode(i18n.language)?.toLowerCase() === iso2.toLowerCase()
    )?.iso2
    if ($dialCodeCountryCode) {
      setValues(($values) => ({
        ...$values,
        phonePrefix: $dialCodeCountryCode,
      }))
    }
  }, [countryPhonePrefixes, i18n.language, setValues])

  useEffect(() => {
    setEmojisSupport(emojiSupport())
  }, [])

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          {!supportEmojis &&
            'Your browser seems to have a custom font configured. Some texts may not be displayed correctly.'}
        </Col>
      </Row>
      <Row className="gy-4">
        <Form.Group as={Col} xs={12} lg={6} controlId={nameId}>
          <Form.Label>
            {capitalizeText(t('sections:contact.form.fields.name.label'), 'simple')}
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
            isInvalid={touched.name && !!errors.name}
            disabled={isSubmitting}
          />
          {touched.name && !!errors.name && (
            <Form.Control.Feedback type="invalid">
              {errors.name && capitalizeText(t(errors.name), 'simple')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group as={Col} xs={12} lg={6} controlId={surnameId}>
          <Form.Label>
            {capitalizeText(t('sections:contact.form.fields.surname.label'), 'simple')}
          </Form.Label>
          <Form.Control
            type="text"
            name="surname"
            onChange={handleChange}
            value={values.surname}
            isInvalid={touched.surname && !!errors.surname}
            disabled={isSubmitting}
          />
          {touched.surname && !!errors.surname && (
            <Form.Control.Feedback type="invalid">
              {errors.surname && capitalizeText(t(errors.surname), 'simple')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Col xs={12} lg>
          <Form.Label htmlFor={phoneNumberId}>
            {capitalizeText(t('sections:contact.form.fields.phone.label'), 'simple')}
          </Form.Label>
          <InputGroup>
            <Form.Select
              id={phonePrefixId}
              aria-label={
                capitalizeText(t('sections:contact.form.fields.phone.label'), 'simple')
              }
              name="phonePrefix"
              onChange={handleChange}
              value={values.phonePrefix}
              disabled={isSubmitting}
            >
              {countryPhonePrefixes
                .map(({ dialCode, name, iso2 }, key) => (
                  <option value={iso2} key={key}>
                    {`${getCountryFlagEmoji(iso2)} ${name} +${dialCode}`}
                  </option>
                ))}
            </Form.Select>
            <Form.Control
              id={phoneNumberId}
              name="phoneNumber"
              type="tel"
              style={{ width: 'auto' }}
              onChange={handleChange}
              value={values.phoneNumber}
              isInvalid={touched.phoneNumber && !!errors.phoneNumber}
              disabled={isSubmitting}
            />
          </InputGroup>
          {touched.phoneNumber && !!errors.phoneNumber && (
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber && capitalizeText(t(errors.phoneNumber), 'simple')}
            </Form.Control.Feedback>
          )}
        </Col>
        <Form.Group as={Col} xs={12} lg controlId={businessNameId}>
          <Form.Label>
            {capitalizeText(t('sections:contact.form.fields.business.label'), 'simple')}
          </Form.Label>
          <Form.Control
            type="text"
            name="businessName"
            onChange={handleChange}
            value={values.businessName}
            isInvalid={touched.businessName && !!errors.businessName}
            disabled={isSubmitting}
          />
          {touched.businessName && !!errors.businessName && (
            <Form.Control.Feedback type="invalid">
              {errors.businessName && capitalizeText(t(errors.businessName), 'simple')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group as={Col} xs={12} controlId={emailId}>
          <Form.Label>
            {capitalizeText(t('sections:contact.form.fields.email.label'), 'simple')}
          </Form.Label>
          <Form.Control
            name="email"
            type="text" // Prevents the mismatch rendering bug between server and client
            onChange={handleChange}
            value={values.email}
            isInvalid={touched.email && !!errors.email}
            disabled={isSubmitting}
          />
          {touched.email && !!errors.email && (
            <Form.Control.Feedback type="invalid">
              {errors.email && capitalizeText(t(errors.email), 'simple')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group as={Col} xs={12} controlId={messageId}>
          <Form.Label>
            {capitalizeText(t('sections:contact.form.fields.message.label'), 'simple')}
            {' '}
            <span className="text-muted">
              ({capitalizeText(t('validation:optional'), 'simple')})
            </span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="message"
            onChange={handleChange}
            value={values.message}
            isInvalid={touched.message && !!errors.message}
            disabled={isSubmitting}
          />
          {values.message.length > 0 && (
            <Form.Text>
              {`${values.message.length}/${MAX_MESSAGE_LENGTH}`}
            </Form.Text>
          )}
          {touched.message && !!errors.message && (
            <Form.Control.Feedback type="invalid">
              {errors.message && capitalizeText(t(errors.message), 'simple')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Row>
      {submitMessage && (
        <Row>
          <Col>
            <Alert
              className="mt-4"
              variant={submitMessage.type === 'error' ? 'danger' : 'success'}
              onClose={() => setSubmitMessage(undefined)}
              dismissible
            >
              {capitalizeText(t(submitMessage.text), 'simple')}
            </Alert>
          </Col>
        </Row>
      )}
      <Row className="d-flex justify-content-end mt-4">
        <Col xs={12} lg="auto">
          <Button type="submit" className="text-light" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : 'Send'}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default ContactForm
