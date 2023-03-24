import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons/faCheckToSlot'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type {
  PasswordGeneratorFormProps,
  PasswordGeneratorRef,
} from '@stratego/components/forms/password-generator-form'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import classNames from 'classnames'
import type { GetStaticProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { forwardRef, useCallback, useRef, useState } from 'react'
import { ContainerProps } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

const PasswordGeneratorFormWrapper = dynamic(
  import('@stratego/components/forms/password-generator-form'),
  {
    ssr: false,
  }
)

const Container = dynamic(
  () =>
    import('react-bootstrap/Container') as unknown as Promise<
      React.ComponentType<React.HTMLAttributes<HTMLElement> & ContainerProps>
    >
)

const Row = dynamic(import('react-bootstrap/Row'))

const Col = dynamic(import('react-bootstrap/Col'))

const Table = dynamic(import('react-bootstrap/Table'))

const Layout = dynamic(import('@stratego/components/shared/layout'))

const PasswordGeneratorFormWrapperForwarded: React.FC<
  React.PropsWithRef<
    PasswordGeneratorFormProps & {
      ref: React.Ref<PasswordGeneratorRef>
    }
  >
> = forwardRef((props, ref) => {
  return <PasswordGeneratorFormWrapper {...props} forwardedRef={ref} />
})

PasswordGeneratorFormWrapperForwarded.displayName =
  'PasswordGeneratorFormWrapper'

const PasswordGenerator: NextPage<WithoutProps> = () => {
  const { t } = useTranslation('utils')

  const passwordGeneratorRef = useRef<PasswordGeneratorRef>(null)

  const [generatingPasswords, setGeneratingPasswordsState] =
    useState<boolean>(false)

  const [digest, setDigest] = useState<Array<string>>([])

  const [generatedPasswords, setGeneratedPasswords] = useState<Array<string>>(
    []
  )

  const generatePasswords = useCallback(() => {
    if (passwordGeneratorRef.current?.generatePasswords)
      passwordGeneratorRef.current.generatePasswords()
  }, [passwordGeneratorRef])

  return (
    <Layout
      pageTitle={capitalizeText(t`list.0.title`, 'simple')}
      showNavigationOptions
    >
      <Container className="my-5">
        <Row className="mb-5">
          <Col className={LayoutStyles.autoFormat}>
            <h1 className="fw-bold">
              {capitalizeText(t`list.0.title`, 'simple')}
            </h1>
            <small>{t`list.0.subtitle`}</small>
          </Col>
        </Row>
        <Row className="gap-4">
          <Col xs={12} lg={4}>
            <PasswordGeneratorFormWrapperForwarded
              ref={passwordGeneratorRef}
              onGenerationStateChange={setGeneratingPasswordsState}
              onPasswordGeneration={setGeneratedPasswords}
              onDigestUpdate={(newDigest) => setDigest(newDigest.split(''))}
            />
          </Col>
          <Col xs={12} lg className="">
            <Row className="gap-4">
              <Col xs={12} lg={4}>
                <Button
                  className="fw-bold text-light"
                  size="sm"
                  onClick={generatePasswords}
                  disabled={!digest.hasItems || generatingPasswords}
                >
                  {t`list.0.generate`}
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
                          <small className="font-monospace text-nowrap order-xl-1 order-2">
                            {password}
                          </small>
                          <span className="text-nowrap order-xl-2 order-1">
                            <Link
                              href={{
                                pathname:
                                  '/utilities/password-strength-checker',
                                query: {
                                  check:
                                    Buffer.from(password).toString('base64'),
                                },
                              }}
                              title={t`list.0.check` satisfies string}
                              target="_blank"
                              passHref
                            >
                              <Button variant="link" size="sm">
                                <FontAwesomeIcon icon={faCheckToSlot} />
                              </Button>
                            </Link>
                            <OverlayTrigger
                              placement="left"
                              trigger="focus"
                              overlay={<Tooltip>{t`list.0.copied`}</Tooltip>}
                            >
                              <Button
                                className="d-inline-block"
                                variant="link"
                                size="sm"
                                title={t`list.0.copy` satisfies string}
                                onClick={() =>
                                  navigator.clipboard.writeText(password)
                                }
                              >
                                <FontAwesomeIcon icon={faCopy} />
                              </Button>
                            </OverlayTrigger>
                          </span>
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
