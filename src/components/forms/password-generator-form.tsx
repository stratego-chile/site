import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LettersTable from '@stratego/components/misc/letters-table'
import { randomPick } from '@stratego/helpers/random.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { useFormik } from 'formik'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import {
  Fragment,
  forwardRef,
  useCallback,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import type { ButtonProps } from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Tooltip from 'react-bootstrap/Tooltip'

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

const Button = dynamic(
  () =>
    import('react-bootstrap/Button') as unknown as Promise<
      React.ComponentType<React.HTMLAttributes<HTMLElement> & ButtonProps>
    >
)

const PasswordGeneratorLettersGroupModal = dynamic(
  () => import('@stratego/components/modals/password-letters-group-modal')
)

export type PasswordGeneratorRef = {
  generatePasswords?: () => void
}

export type PasswordGeneratorFormProps = {
  onGenerationStateChange?: (generating: boolean) => void
  onPasswordGeneration?: (generatedPasswords: Array<string>) => void
  onDigestUpdate?: (digest: string) => void
}

const optionsSpec = Object.freeze({
  length: {
    min: 8,
    max: 64,
    step: 1,
  },
  times: {
    min: 1,
    max: 20,
    step: 1,
  },
  includes: {
    minLength: 1,
  },
  case: {
    minLength: 1,
    affects: [
      'regular',
      'special',
    ] as Array<Stratego.Utils.PasswordGenerator.LettersGroup>,
  },
  symbolsWeight: {
    min: 0.1,
    max: 0.8,
    step: 0.01,
  },
})

const baseLetters: Record<
  Stratego.Utils.PasswordGenerator.LettersGroup,
  string
> = Object.freeze({
  regular: 'abcdefghijklmnopqrstuvwxyz',
  special: 'çñüöëïä',
  numbers: '0123456789',
  symbols: '!”#$%&()*+-.:;<=>?@[]^_{|}~',
  whiteSpaces: ' ',
})

const baseLettersCase: ReadonlyArray<Stratego.Utils.PasswordGenerator.LetterCase> =
  Object.freeze(['lower', 'upper'])

const PasswordGeneratorForm = forwardRef<
  PasswordGeneratorRef,
  PasswordGeneratorFormProps
>(({ onPasswordGeneration, onDigestUpdate, onGenerationStateChange }, ref) => {
  const { t } = useTranslation('utils')

  const [editableLettersGroup, setEditableLettersGroup] =
    useState<Stratego.Utils.PasswordGenerator.LettersGroupSpec>()

  const editingLettersGroup = useMemo(
    () => typeof editableLettersGroup !== 'undefined',
    [editableLettersGroup]
  )

  //#region password generation options form configuration
  const initialLettersTypeGroups = Object.freeze({
    regular: baseLetters.regular
      .split('')
      .map((letter) => letter.toLowerCase().concat(letter.toUpperCase()))
      .join(''),
    special: baseLetters.special
      .split('')
      .map((letter) => letter.toLowerCase().concat(letter.toUpperCase()))
      .join(''),
    numbers: baseLetters.numbers,
    symbols: baseLetters.symbols,
    whiteSpaces: baseLetters.whiteSpaces,
  })

  const [letterTypeGroups, setLetterTypeGroups] = useState<typeof baseLetters>(
    initialLettersTypeGroups
  )

  const usableLetterTypeGroups = useDeferredValue(letterTypeGroups)

  const [usableLetters, setUsableLetters] = useState<string>('')

  const updateLettersGroupSpec = useCallback(
    (
      updatedLettersGroupSpec: Stratego.Utils.PasswordGenerator.LettersGroupSpec
    ) => {
      setLetterTypeGroups(($lettersTypeGroups) => ({
        ...$lettersTypeGroups,
        [updatedLettersGroupSpec.name]: updatedLettersGroupSpec.letters,
      }))
      setEditableLettersGroup(undefined)
    },
    []
  )

  const generatePasswords = useCallback(
    async (options: Stratego.Utils.PasswordGenerator.GeneratorOptions) => {
      if (editingLettersGroup) return

      const { default: shuffle } = await import('@stdlib/random/shuffle')

      const passwords: Array<string> = []

      while (passwords.length < options.times) {
        const digest = shuffle(usableLetters.split('')) as Array<string>

        let password = String()

        do
          password = new Array<Array<string>>(options.length)
            .fill(digest)
            .map(
              (letters) => letters[Math.floor(Math.random() * letters.length)]
            )
            .join('')
        while (passwords.includes(password))

        passwords.push(password)
      }

      onPasswordGeneration?.(passwords)
    },
    [editingLettersGroup, onPasswordGeneration, usableLetters]
  )

  const {
    initialValues,
    isSubmitting,
    values: optionFormValues,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    submitForm,
  } = useFormik<Stratego.Utils.PasswordGenerator.GeneratorOptions>({
    initialValues: {
      length: 32,
      times: 5,
      include: Object.keys(
        usableLetterTypeGroups
      ) as Array<Stratego.Utils.PasswordGenerator.LettersGroup>,
      case: baseLettersCase.slice(),
      symbolsWeight: 0.25,
    },
    onSubmit: generatePasswords,
    onReset: () => {
      setLetterTypeGroups(initialLettersTypeGroups)
      onPasswordGeneration?.([])
    },
  })

  useEffect(
    () => onGenerationStateChange && onGenerationStateChange(isSubmitting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSubmitting]
  )

  // Get the usable letters to shuffle
  useEffect(() => {
    if (editingLettersGroup) return

    const lettersGroups = optionFormValues.include.map((lettersGroup) => [
      lettersGroup,
      usableLetterTypeGroups[lettersGroup],
    ]) as Array<[Stratego.Utils.PasswordGenerator.LettersGroup, string]>

    let $usableLetters = ''

    do {
      const staticDigest = optionFormValues.include.includes('symbols')
        ? randomPick(
            [
              lettersGroups
                .filter(([lettersGroupName]) => lettersGroupName !== 'symbols')
                .map(([, lettersGroup]) => lettersGroup)
                .join(''),
              usableLetterTypeGroups.symbols,
            ],
            {
              syntheticWeight: {
                1: optionFormValues.symbolsWeight ?? 0.25,
              },
            }
          )
        : lettersGroups.map(([, lettersGroup]) => lettersGroup).join('')

      const letter = staticDigest.charAt(
        Math.floor(Math.random() * staticDigest.length)
      )

      // Prevents duplicated letters to respect the selection weight ratio
      if (!$usableLetters.includes(letter))
        $usableLetters = $usableLetters.concat(letter)
    } while (
      $usableLetters.length <
      lettersGroups.map(([, lettersGroup]) => lettersGroup).join('').length
    )

    setUsableLetters($usableLetters)

    onDigestUpdate?.($usableLetters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    usableLetterTypeGroups,
    optionFormValues.include,
    optionFormValues.symbolsWeight,
  ])

  // Update the case of usable letters
  useEffect(() => {
    if (optionFormValues.case.hasItems) {
      const lettersGroups = { ...usableLetterTypeGroups }
      ;(
        Object.entries(lettersGroups) as Array<
          [Stratego.Utils.PasswordGenerator.LettersGroup, string]
        >
      ).forEach(([lettersGroupName, lettersGroup]) => {
        const letters = optionsSpec.case.affects.includes(lettersGroupName)
          ? Array.from(
              new Set(
                lettersGroup
                  .split('')
                  .map((letter) => [
                    optionFormValues.case.includes('upper')
                      ? letter.toUpperCase()
                      : undefined,
                    optionFormValues.case.includes('lower')
                      ? letter.toLowerCase()
                      : undefined,
                  ])
                  .flatMap((letter) => letter)
                  .filter((letter) => !!letter) as Array<string>
              )
            ).join('')
          : lettersGroup

        lettersGroups[lettersGroupName] = letters
      })
      setLetterTypeGroups(lettersGroups)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionFormValues.case])

  // Prevents the form from being submitted without any letters type selected
  useEffect(() => {
    if (!optionFormValues.include.hasItems)
      setValues(($values) => ({
        ...$values,
        include: [
          Object.keys(
            usableLetterTypeGroups
          ).shift() as Stratego.Utils.PasswordGenerator.LettersGroup,
        ],
      }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionFormValues.include, setValues])

  // Prevents the form from being submitted without any letters case selected
  useEffect(() => {
    if (!optionFormValues.case.hasItems)
      setValues(($values) => ({
        ...$values,
        case: [
          baseLettersCase
            .slice()
            .shift() as Stratego.Utils.PasswordGenerator.LetterCase,
        ],
      }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionFormValues.case, setValues])
  //#endregion

  useImperativeHandle(
    ref,
    () => ({
      generatePasswords: submitForm,
    }),
    [submitForm]
  )

  return (
    <Fragment>
      {editableLettersGroup && (
        <PasswordGeneratorLettersGroupModal
          show={editingLettersGroup}
          lettersGroupSpec={editableLettersGroup}
          onLettersGroupSpecChange={updateLettersGroupSpec}
          onCancel={() => setEditableLettersGroup(undefined)}
        />
      )}
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-end">
          <Col xs="auto" className="position-absolute">
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="top"
              overlay={
                <Tooltip>{t`common:controls.reset` satisfies string}</Tooltip>
              }
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  resetForm({
                    values: initialValues,
                  })
                }}
              >
                <FontAwesomeIcon icon={faUndo} />
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
        <Row className="gap-4">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>{t`list.0.include`}</Form.Label>
              {(
                Object.entries(usableLetterTypeGroups) as Array<
                  [Stratego.Utils.PasswordGenerator.LettersGroup, string]
                >
              ).map(([letterType, letters], key) => (
                <div key={key} className="d-flex align-items-start">
                  <Form.Check
                    name="include"
                    type="checkbox"
                    label={
                      <Fragment>
                        {letters.trim().split('').hasItems && (
                          <Fragment>
                            <OverlayTrigger
                              trigger={['click', 'hover']}
                              overlay={
                                <Popover body>
                                  <p>{t`list.0.availableLetters`}</p>
                                  <LettersTable letters={letters} />
                                </Popover>
                              }
                            >
                              <FontAwesomeIcon icon={faCircleInfo} />
                            </OverlayTrigger>
                            &ensp;
                          </Fragment>
                        )}
                        {t(`list.0.${letterType}`)}
                        {letters.trim().split('').hasItems && (
                          <Fragment>
                            &ensp;
                            <Button
                              className="p-0"
                              variant="link"
                              size="sm"
                              onClick={() => {
                                setEditableLettersGroup({
                                  name: letterType,
                                  letters: letters,
                                  range: baseLetters[letterType],
                                })
                              }}
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Button>
                          </Fragment>
                        )}
                      </Fragment>
                    }
                    value={letterType}
                    onChange={handleChange}
                    checked={optionFormValues.include.includes(
                      letterType as Stratego.Utils.PasswordGenerator.LettersGroup
                    )}
                  />
                </div>
              ))}
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group>
              <Form.Label>
                {capitalizeText(t`list.0.case`, 'simple')}
              </Form.Label>
              {baseLettersCase.map((lettersCase, key) => (
                <Form.Check
                  key={key}
                  name="case"
                  type="checkbox"
                  label={capitalizeText(t(`list.0.${lettersCase}`), 'simple')}
                  value={lettersCase}
                  onChange={handleChange}
                  checked={optionFormValues.case.includes(lettersCase)}
                />
              ))}
            </Form.Group>
          </Col>
          {optionFormValues.include.includes('symbols') && (
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="d-flex justify-content-between">
                  {t`list.0.symbolsWeight`}
                  {optionFormValues.symbolsWeight && (
                    <span>
                      {(optionFormValues.symbolsWeight * 100).toFixed(0)}%
                    </span>
                  )}
                </Form.Label>
                <Form.Range
                  name="symbolsWeight"
                  onChange={handleChange}
                  value={optionFormValues.symbolsWeight}
                  step={optionsSpec.symbolsWeight.step}
                  min={optionsSpec.symbolsWeight.min}
                  max={optionsSpec.symbolsWeight.max}
                />
              </Form.Group>
            </Col>
          )}
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="d-flex justify-content-between">
                {t`list.0.length`}
                <span>{optionFormValues.length}</span>
              </Form.Label>
              <Form.Range
                name="length"
                onChange={handleChange}
                value={optionFormValues.length}
                step={optionsSpec.length.step}
                min={optionsSpec.length.min}
                max={optionsSpec.length.max}
              />
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="d-flex justify-content-between">
                {t`list.0.times`}
                <span>{optionFormValues.times}</span>
              </Form.Label>
              <Form.Range
                name="times"
                onChange={handleChange}
                value={optionFormValues.times}
                step={optionsSpec.times.step}
                min={optionsSpec.times.min}
                max={optionsSpec.times.max}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Fragment>
  )
})

PasswordGeneratorForm.displayName = 'PasswordGeneratorForm'

PasswordGeneratorForm.propTypes = {
  onDigestUpdate: PropTypes.func,
  onGenerationStateChange: PropTypes.func,
  onPasswordGeneration: PropTypes.func,
}

const PasswordGeneratorFormWrapper: React.FC<
  PasswordGeneratorFormProps & {
    forwardedRef: React.Ref<PasswordGeneratorRef>
  }
> = ({ forwardedRef, ...props }) => {
  return <PasswordGeneratorForm {...props} ref={forwardedRef} />
}

export default PasswordGeneratorFormWrapper
