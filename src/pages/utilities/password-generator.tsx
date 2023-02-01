import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import type { GetStaticProps, NextPage } from 'next'
import shuffle from '@stdlib/random/shuffle'
import { useCallback, useDeferredValue, useId, useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Tooltip from 'react-bootstrap/Tooltip'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaultLocale } from '@stratego/locales'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faCopy } from '@fortawesome/free-regular-svg-icons'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { capitalizeText } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import { Trans, useTranslation } from 'next-i18next'
import Link from 'next/link'

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>

type Characters = 'regular' | 'special' | 'numbers' | 'symbols'

type GeneratorOptions = {
  length: IntRange<8, 65>
  times: IntRange<1, 21>
  include: Array<Characters>
}

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const PasswordGenerator: NextPage<WithoutProps> = () => {
  const { t } = useTranslation('utils')

  const [generatedPasswords, setGeneratedPasswords] = useState<Array<string>>(
    []
  )

  // TODO: add chars customization
  const [chars] = useState({
    regular: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    special: 'çñüöëïä',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+¿',
  } as Record<Characters, string>)

  //#region password generation options form
  const formId = useId()

  const getControlId = useCallback(
    (ref: string) => formId.concat('-', ref),
    [formId]
  )

  const defaultOptions: GeneratorOptions = {
    length: 24,
    times: 5,
    include: Object.keys(chars) as Array<Characters>,
  }

  const validationSchema = Yup.object().shape({
    length: Yup.number().required().min(8).max(64),
    times: Yup.number().required().min(1).max(20),
    include: Yup.array().required().min(1),
  })

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: defaultOptions,
    onSubmit: () => {},
    validationSchema,
  })

  const options = useDeferredValue(values)
  //#endregion

  const usableChars = useMemo(
    () =>
      options.include
        .map((charGroup) => chars[charGroup])
        .flatMap((characters) => characters.split('')),
    [chars, options.include]
  )

  const generatePassword = useCallback(() => {
    const $generatedPasswords = new Array<Array<string>>(options.times)
      .fill(usableChars)
      .map((digest) => {
        const mixedShuffle = shuffle(digest)
        return new Array(options.length)
          .fill(mixedShuffle)
          .map(
            (characters) =>
              characters[Math.floor(Math.random() * characters.length)]
          )
          .join('')
      })
    setGeneratedPasswords($generatedPasswords)
  }, [usableChars, options])

  return (
    <Layout
      pageTitle={capitalizeText(t('list.0.title'), 'simple')}
      showNavigationOptions
    >
      <Container className="my-5">
        <Row className="mb-5">
          <Col className={LayoutStyles.autoFormat}>
            <h1 className="fw-bold">
              {capitalizeText(t('list.0.title'), 'simple')}
            </h1>
            <small>{t('list.0.subtitle')}</small>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={3}>
            <Form onSubmit={handleSubmit}>
              <Row className="gap-4">
                <Col xs={12}>
                  <Form.Group controlId={getControlId('include')}>
                    <Form.Label>{t('list.0.include')}</Form.Label>
                    {Object.entries(chars).map(([key, charArray], index) => (
                      <div key={index} className="d-flex align-items-center">
                        <OverlayTrigger
                          trigger={['click', 'hover']}
                          overlay={
                            <Popover body>
                              <p>{t('list.0.availableChars')}</p>
                              <Table bordered size="sm">
                                <tbody>
                                  {(($charArray) => {
                                    const $rows = []
                                    const segmentLength = 10
                                    for (
                                      let i = 0;
                                      i < $charArray.length;
                                      i += segmentLength
                                    ) {
                                      $rows.push(
                                        <tr key={i} className="border-bottom-0">
                                          {$charArray
                                            .slice(i, i + segmentLength)
                                            .map((char, $index) => (
                                              <td
                                                key={$index}
                                                className="text-center border-bottom"
                                              >
                                                {char}
                                              </td>
                                            ))}
                                        </tr>
                                      )
                                    }
                                    return $rows
                                  })(charArray.split(''))}
                                </tbody>
                              </Table>
                            </Popover>
                          }
                        >
                          <FontAwesomeIcon icon={faCircleQuestion} />
                        </OverlayTrigger>
                        &ensp;
                        <Form.Check
                          disabled={index === 0}
                          name="include"
                          type="checkbox"
                          label={t(`list.0.${key}`)}
                          value={key}
                          onChange={handleChange}
                          checked={values.include.includes(
                            key as keyof typeof chars
                          )}
                        />
                      </div>
                    ))}
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId={getControlId('times')}>
                    <Form.Label>
                      {t('list.0.times')} ({options.times})
                    </Form.Label>
                    <Form.Range
                      name="times"
                      onChange={handleChange}
                      value={values.times}
                      step={1}
                      min={
                        (
                          (validationSchema.describe().fields.times as any)
                            .tests as Array<any>
                        ).find(({ name }) => name === 'min')?.params?.min as
                          | number
                          | undefined
                      }
                      max={
                        (
                          (validationSchema.describe().fields.times as any)
                            .tests as Array<any>
                        ).find(({ name }) => name === 'max')?.params?.max as
                          | number
                          | undefined
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group controlId={getControlId('length')}>
                    <Form.Label>
                      {t('list.0.length')} ({options.length})
                    </Form.Label>
                    <Form.Range
                      name="length"
                      onChange={handleChange}
                      value={values.length}
                      step={1}
                      min={
                        (
                          (validationSchema.describe().fields.length as any)
                            .tests as Array<any>
                        ).find(({ name }) => name === 'min')?.params?.min as
                          | number
                          | undefined
                      }
                      max={
                        (
                          (validationSchema.describe().fields.length as any)
                            .tests as Array<any>
                        ).find(({ name }) => name === 'max')?.params?.max as
                          | number
                          | undefined
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col xs={12} lg className="bg-light rounded-2 py-3">
            <Row className="gap-4">
              <Col xs={12} lg={4}>
                <Button
                  variant="info"
                  className="fw-bold text-light"
                  onClick={generatePassword}
                >
                  {t('list.0.generate')}
                </Button>
              </Col>
              <Col xs={12}>
                <Table responsive hover size="sm">
                  <tbody>
                    {generatedPasswords.map((password, key) => (
                      <tr key={key}>
                        <th
                          scope="row"
                          className={classNames(
                            'd-flex justify-content-between align-items-center gap-4',
                            'fw-normal'
                          )}
                        >
                          <small className="font-monospace">{password}</small>
                          <OverlayTrigger
                            placement="left"
                            trigger="focus"
                            overlay={<Tooltip>{t('list.0.copied')}</Tooltip>}
                          >
                            <Button
                              className="d-inline-block"
                              variant="link"
                              size="sm"
                              title={t('list.0.copy') satisfies string}
                              onClick={() =>
                                navigator.clipboard.writeText(password)
                              }
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </Button>
                          </OverlayTrigger>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="mt-5">
            <small className="fst-italic">
              <Trans
                t={t}
                i18nKey="utils:footNote"
                components={{
                  redirect: (
                    <Link
                      href="https://github.com/stratego-chile/site/blob/main/src/pages/utilities/password-generator.tsx"
                      target="_blank"
                      rel="noreferrer noopener"
                    />
                  ),
                }}
              />
            </small>
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
      'utils',
    ])),
  },
})

export default PasswordGenerator
