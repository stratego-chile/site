import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faBroom } from '@fortawesome/free-solid-svg-icons/faBroom'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import {
  passwordStrength as getPasswordStrength,
  type Result as PasswordStrengthResult,
} from 'check-password-strength'
import type { GetStaticProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import ListGroup from 'react-bootstrap/ListGroup'

type PasswordStrengthId = 0 | 1 | 2 | 3

const Layout = dynamic(import('@stratego/components/shared/layout'))

const Container = dynamic(import('react-bootstrap/Container'))

const Row = dynamic(import('react-bootstrap/Row'))

const Col = dynamic(import('react-bootstrap/Col'))

const Button = dynamic(import('react-bootstrap/Button'))

const PasswordStrengthChecker: NextPage<WithoutProps> = () => {
  const router = useRouter()

  const { t } = useTranslation('utils')

  const strengthSemaphore: Record<PasswordStrengthId, string> = {
    0: 'deep-red',
    1: 'danger',
    2: 'warning',
    3: 'success',
  }

  const [visible, setVisibility] = useState(false)

  const [password, setPassword] = useState('')

  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrengthResult<string>>()

  useEffect(() => {
    if (password.length > 0) {
      const strength = getPasswordStrength(password)
      setPasswordStrength(strength)
    } else setPasswordStrength(undefined)
  }, [password])

  useEffect(() => {
    if (router.isReady) {
      const { query } = router
      if (query.check) {
        setPassword(
          Buffer.from(query.check.toString(), 'base64').toString('utf-8')
        )
      }
    }
  }, [router])

  return (
    <Layout
      pageTitle={capitalizeText(t`list.1.title` satisfies string, 'simple')}
      showNavigationOptions
    >
      <Container className="d-flex flex-column my-5 gap-4">
        <Row>
          <Col className={LayoutStyles.autoFormat}>
            <h1 className="fw-bold">
              {capitalizeText(t`list.1.title`, 'simple')}
            </h1>
            <small>{t`list.1.subtitle`}</small>
          </Col>
        </Row>
        <Row>
          <Form>
            <Row className="gy-4">
              <Col xs={12} xxl={3}>
                <Form.Label>
                  {capitalizeText(t`list.1.label`, 'simple')}
                </Form.Label>
              </Col>
              <Col xs={12} xxl={6}>
                <InputGroup>
                  <Form.Control
                    type={visible ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setVisibility((state) => !state)}
                  >
                    <FontAwesomeIcon
                      icon={visible ? faEyeSlash : faEye}
                      fixedWidth
                    />
                  </Button>
                  {password.length > 0 && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setPassword('')}
                    >
                      <FontAwesomeIcon icon={faBroom} fixedWidth />
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col
                xs={12}
                xxl={{
                  offset: 3,
                  span: 6,
                }}
                className="d-inline-flex flex-column align-self-end gap-4"
              >
                {typeof passwordStrength !== 'undefined' && (
                  <Fragment>
                    <Alert
                      variant={
                        strengthSemaphore[
                          passwordStrength.id as PasswordStrengthId
                        ]
                      }
                      className="mb-0"
                    >
                      {t(`list.1.strength.${passwordStrength.id}`)}
                    </Alert>
                    <Alert variant="secondary" className="mb-0">
                      {t(`list.1.diversityType.title`)}:
                      {passwordStrength.contains.hasItems && (
                        <ListGroup className="mb-0">
                          {passwordStrength.contains.map(
                            (diversityType, key) => (
                              <ListGroup.Item
                                key={key}
                                variant="secondary"
                                className="d-inline-flex align-items-center gap-1 border-0 p-0"
                              >
                                <FontAwesomeIcon
                                  className="text-success bg-light rounded-circle"
                                  icon={faCheckCircle}
                                />
                                <span>
                                  {t(`list.1.diversityType.${diversityType}`)}
                                </span>
                              </ListGroup.Item>
                            )
                          )}
                        </ListGroup>
                      )}
                    </Alert>
                  </Fragment>
                )}
              </Col>
            </Row>
          </Form>
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
                      href="https://github.com/stratego-chile/site/blob/main/src/pages/utilities/password-strength-checker.tsx"
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

export default PasswordStrengthChecker
