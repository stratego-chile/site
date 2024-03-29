import dialCodes, { type DialCodeSpec } from '@stratego/data/dial-codes'
import {
  capitalizeText,
  getCountryFlagEmoji,
  phoneFormatSpec,
} from '@stratego/helpers/text.helper'
import requester from 'axios'
import emojiSupport from 'detect-emoji-support'
import { useFormik, type FormikHelpers } from 'formik'
import { getCountryCode } from 'language-flag-colors'
import { useTranslation } from 'next-i18next'
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import * as Yup from 'yup'

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

const ContactForm: React.FC<WithoutProps> = () => {
  const { t, i18n } = useTranslation('sections')

  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  }>()

  const formId = useId()

  const getControlId = useCallback(
    (controlName: string) => formId.concat('-', controlName),
    [formId]
  )

  const $countryPhonePrefixes = useMemo(
    () =>
      dialCodes.map(({ name, ...data }) => ({
        name: name.replace(/ *\([^)]*\) */g, ''),
        ...data,
      })),
    []
  )

  const countryPhonePrefixes = useDeferredValue($countryPhonePrefixes)

  const [supportEmojis, setEmojisSupport] = useState(false)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const validationSchema = Yup.object({
    name: Yup.string().required('validation:required'),
    surname: Yup.string().required('validation:required'),
    phonePrefix: Yup.string().required('validation:required'),
    phoneNumber: Yup.string()
      .matches(phoneFormatSpec, 'validation:invalidPhoneNumber')
      .required('validation:required'),
    businessName: Yup.string().required('validation:required'),
    email: Yup.string()
      .email('validation:email')
      .required('validation:required'),
    message: Yup.string(),
  })

  const handleSubmission = useCallback(
    (values: ContactData, helpers: FormikHelpers<ContactData>) => {
      if (!executeRecaptcha) return

      setSubmitMessage(undefined)

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
            },
          })
          .then(({ data }) =>
            setSubmitMessage({
              type: data.status === 'OK' ? 'success' : 'error',
              text:
                data.status === 'OK'
                  ? 'sections:contact.form.messages.success'
                  : 'common:errors.submit',
            })
          )
          .catch((error) => {
            console.warn(error)
            setSubmitMessage({
              type: 'error',
              text: 'common:errors.submit',
            })
          })
          .finally(() => helpers.setSubmitting(false))
      })
    },
    [countryPhonePrefixes, i18n.language, executeRecaptcha]
  )

  const {
    initialValues,
    errors,
    isSubmitting,
    touched,
    values,
    handleChange,
    handleSubmit,
    setTouched,
    setValues,
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
    onSubmit: handleSubmission,
  })

  const getLocaleCountryCode = (
    prefixes: Array<DialCodeSpec>,
    locale: string
  ) =>
    prefixes.find(
      ({ iso2 }) => getCountryCode(locale)?.toLowerCase() === iso2.toLowerCase()
    )?.iso2

  // When the language changes, update the default phone prefix value
  useEffect(() => {
    setValues((currentValues) => ({
      ...currentValues,
      phonePrefix:
        getLocaleCountryCode(countryPhonePrefixes, i18n.language) || '',
    }))
  }, [countryPhonePrefixes, i18n, setValues])

  // When the form is submitted successfully, reset the form values and mark all fields as untouched
  useEffect(() => {
    if (
      submitMessage?.type === 'success' &&
      process.env.NODE_ENV !== 'development'
    ) {
      setValues({
        ...initialValues,
        phonePrefix:
          getLocaleCountryCode(countryPhonePrefixes, i18n.language) || '',
      })
      setTouched({}, false)
    }
  }, [
    countryPhonePrefixes,
    i18n,
    initialValues,
    submitMessage,
    setValues,
    setTouched,
  ])

  // Check if flags can be shown using emojis
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
        <Form.Group as={Col} xs={12} lg={6} controlId={getControlId('name')}>
          <Form.Label>
            {capitalizeText(
              t`sections:contact.form.fields.name.label`,
              'simple'
            )}
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
        <Form.Group as={Col} xs={12} lg={6} controlId={getControlId('surname')}>
          <Form.Label>
            {capitalizeText(
              t`sections:contact.form.fields.surname.label`,
              'simple'
            )}
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
          <Form.Label htmlFor={getControlId('phoneNumber')}>
            {capitalizeText(
              t`sections:contact.form.fields.phone.label`,
              'simple'
            )}
          </Form.Label>
          <InputGroup>
            <Form.Select
              id={getControlId('phonePrefix')}
              aria-label={capitalizeText(
                t`sections:contact.form.fields.phone.label`,
                'simple'
              )}
              name="phonePrefix"
              onChange={handleChange}
              value={values.phonePrefix}
              disabled={isSubmitting}
              style={{
                width: ((phonePrefixLength) =>
                  phonePrefixLength ? phonePrefixLength + 'ch' : undefined)(
                  countryPhonePrefixes.find(
                    ({ iso2 }) => iso2 === values.phonePrefix
                  )?.name.length
                ),
              }}
            >
              {countryPhonePrefixes.map(({ dialCode, name, iso2 }, key) => (
                <option value={iso2} key={key}>
                  {`${getCountryFlagEmoji(iso2)} ${name} +${dialCode}`}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              id={getControlId('phoneNumber')}
              name="phoneNumber"
              type="tel"
              className="w-auto"
              onChange={handleChange}
              value={values.phoneNumber}
              isInvalid={touched.phoneNumber && !!errors.phoneNumber}
              disabled={isSubmitting}
            />
          </InputGroup>
          {touched.phoneNumber && !!errors.phoneNumber && (
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber &&
                capitalizeText(t(errors.phoneNumber), 'simple')}
            </Form.Control.Feedback>
          )}
        </Col>
        <Form.Group
          as={Col}
          xs={12}
          lg
          controlId={getControlId('businessName')}
        >
          <Form.Label>
            {capitalizeText(
              t`sections:contact.form.fields.business.label`,
              'simple'
            )}
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
              {errors.businessName &&
                capitalizeText(t(errors.businessName), 'simple')}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group as={Col} xs={12} controlId={getControlId('email')}>
          <Form.Label>
            {capitalizeText(
              t`sections:contact.form.fields.email.label`,
              'simple'
            )}
          </Form.Label>
          <Form.Control
            name="email"
            // Should be an email field, but it throws a server/client render mismatch
            type="text" // Prevents the mismatch rendering bug
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
        <Form.Group as={Col} xs={12} controlId={getControlId('message')}>
          <Form.Label>
            {capitalizeText(
              t`sections:contact.form.fields.message.label`,
              'simple'
            )}{' '}
            <span className="text-muted">
              ({capitalizeText(t`validation:optional`, 'simple')})
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
      <Row className="mt-4">
        <Col xs={12} className="text-lg-end text-center">
          <Button
            type="submit"
            className="text-light rounded-pill"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner size="sm" />
            ) : (
              capitalizeText(t`sections:contact.form.buttons.submit`, 'simple')
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

ContactForm.propTypes = {}

ContactForm.displayName = 'ContactForm'

export default ContactForm
