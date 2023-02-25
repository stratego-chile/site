import { capitalizeText } from '@stratego/helpers/text.helper'
import { useFormik } from 'formik'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useEffect, useState, type FC } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import * as Yup from 'yup'

type PasswordGeneratorLettersGroupFormProps = {
  lettersGroupSpec: Stratego.Utils.PasswordGenerator.LettersGroupSpec
  onLettersGroupSpecChange?: (
    lettersGroupSpec: Stratego.Utils.PasswordGenerator.LettersGroupSpec
  ) => void
  onCancel?: () => void
}

const PasswordGeneratorLettersGroupForm: FC<
  PasswordGeneratorLettersGroupFormProps
> = ({ onCancel, lettersGroupSpec, onLettersGroupSpecChange }) => {
  const { t } = useTranslation('utils')

  const [usableLetters, setUsableLetters] = useState<string>(
    lettersGroupSpec.range
  )

  const { values, handleChange, handleSubmit, setValues } = useFormik<{
    letters: string
  }>({
    initialValues: {
      letters: '',
    },
    validationSchema: Yup.object({
      letters: Yup.string().required(),
    }),
    onSubmit: () => {
      if (lettersGroupSpec && usableLetters.length > 0)
        onLettersGroupSpecChange?.({
          name: lettersGroupSpec.name,
          letters: usableLetters,
          range: lettersGroupSpec.range,
        })
    },
  })

  useEffect(() => {
    const $usableLetters = values.letters
      .split('')
      .filter(
        (letter) =>
          lettersGroupSpec.range.includes(letter.toLowerCase()) ||
          lettersGroupSpec.range.includes(letter.toUpperCase())
      )
      .join('')
    setUsableLetters(
      Array.from(
        new Set(
          ($usableLetters.length > 0
            ? $usableLetters
            : lettersGroupSpec.range
          ).split('')
        )
      ).join('')
    )
  }, [lettersGroupSpec, values.letters])

  useEffect(() => {
    setValues({
      letters: lettersGroupSpec.letters,
    })
  }, [lettersGroupSpec, setValues])

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {lettersGroupSpec?.name && (
        <Row>
          <Col>
            {capitalizeText(t(`list.0.${lettersGroupSpec.name}`), 'simple')}
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>{capitalizeText(t`list.0.letters`)}</Form.Label>
            <Form.Control
              as="textarea"
              name="letters"
              onChange={handleChange}
              value={values.letters}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>{capitalizeText(t`list.0.result`)}</Form.Label>
            <Form.Control as="textarea" readOnly value={usableLetters} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end gap-2">
          <Button size="sm" type="submit" className="text-light">
            {capitalizeText(t`common:controls.update`, 'simple')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={onCancel}
          >
            {capitalizeText(t`common:controls.cancel`, 'simple')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

PasswordGeneratorLettersGroupForm.displayName =
  'PasswordGeneratorLettersGroupForm'

PasswordGeneratorLettersGroupForm.propTypes = {
  lettersGroupSpec: PropTypes.shape({
    name: PropTypes.string
      .isRequired as PropTypes.Validator<Stratego.Utils.PasswordGenerator.LettersGroup>,
    letters: PropTypes.string.isRequired,
    range: PropTypes.string.isRequired,
  }).isRequired,
  onLettersGroupSpecChange: PropTypes.func,
}

export default PasswordGeneratorLettersGroupForm
