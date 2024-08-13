import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import LayoutStyles from '@stratego/styles/modules/Layout.module.sass'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import type { ContainerProps } from 'react-bootstrap/Container'

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const Container = dynamic(
  () =>
    import('react-bootstrap/Container') as unknown as Promise<
      React.ComponentType<React.HTMLAttributes<HTMLElement> & ContainerProps>
    >
)

const Row = dynamic(() => import('react-bootstrap/Row'))

const Col = dynamic(() => import('react-bootstrap/Col'))

const Contact: NextPage<WithoutProps> = () => {
  const { t } = useTranslation()

  return (
    <Layout
      className={LayoutStyles.autoFormat}
      pageTitle={capitalizeText(t`sections:contact.title`, 'simple')}
      showNavigationOptions
    >
      <script src="https://link.msgsndr.com/js/form_embed.js" defer />

      <Container className="d-flex flex-column mb-5 gap-5 py-5">
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
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/K9l8TpkMJ5ghvGd0Aa9V"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                minHeight: '85vh',
              }}
              id="inline-K9l8TpkMJ5ghvGd0Aa9V"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="contacto WEB"
              data-height="649"
              data-layout-iframe-id="inline-K9l8TpkMJ5ghvGd0Aa9V"
              data-form-id="K9l8TpkMJ5ghvGd0Aa9V"
              title="contacto WEB"
            />
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
      'validation',
    ])),
  },
})

export default Contact
