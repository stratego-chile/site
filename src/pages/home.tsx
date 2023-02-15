import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LoadingPlaceholder from '@stratego/components/shared/loading-placeholder'
import { services } from '@stratego/data/home-content'
import { cybersecurityLinks } from '@stratego/data/navigation-links'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import HomeStyles from '@stratego/styles/modules/Home.module.sass'
import classNames from 'classnames'
import { type GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'

const Layout = dynamic(() => import('@stratego/components/shared/layout'))

const ShowOnScroll = dynamic(
  () => import('@stratego/components/animations/show-on-scroll')
)

const DynamicContactForm = dynamic(
  () => import('@stratego/components/forms/contact-form'),
  {
    loading: ({ isLoading, error }) => (
      <LoadingPlaceholder loading={isLoading} error={error} />
    ),
    ssr: false,
  }
)

const Home: NextPage<WithoutProps> = () => {
  const { t } = useTranslation('sections')

  return (
    <Layout
      pageTitle={capitalizeText(t`sections:home.title` satisfies string)}
      showNavigationOptions
      className={classNames('d-flex flex-column', HomeStyles.homeWrapper)}
    >
      <Container fluid className={classNames(HomeStyles.banner)}>
        <Row className="py-5">
          <Col
            className={classNames(
              'align-items-center justify-content-center justify-content-lg-start'
            )}
          >
            <Container
              className={classNames(
                'd-flex flex-column align-self-stretch align-content-center'
              )}
            >
              <Row className="d-flex align-items-center">
                <Col className="text-center text-lg-start order-2 order-lg-1">
                  <div className={classNames(HomeStyles.sectionContent)}>
                    <span className="fs-2 d-none d-lg-inline">
                      {capitalizeText(
                        t`sections:home.fragments.emphasisTitles.presentation.appendix`,
                        'simple'
                      )}
                    </span>
                    <br />
                    {capitalizeText(
                      t`sections:home.fragments.emphasisTitles.presentation.title.regular`,
                      'simple'
                    )}{' '}
                    <span className="text-info">
                      {t`sections:home.fragments.emphasisTitles.presentation.title.emphasis`.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-shadow my-4 fs-5">
                    {capitalizeText(
                      t`sections:home.fragments.emphasisTitles.presentation.subtitle`,
                      'simple'
                    )}
                  </p>
                  <Link
                    href={cybersecurityLinks.at(0)!.subLinks!.at(0)!.href!}
                    passHref
                  >
                    <Button
                      variant="primary"
                      className="rounded-pill text-light"
                    >
                      {capitalizeText(t`common:learnMore`, 'simple')}
                    </Button>
                  </Link>
                </Col>
                <Col xs={12} lg="auto" className="order-1 order-lg-2">
                  <ShowOnScroll direction="left">
                    <Image
                      src="/images/figure-0.png"
                      style={{
                        width: '34rem',
                      }}
                      alt=""
                      fluid
                    />
                  </ShowOnScroll>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container
        fluid
        className={classNames(
          'd-flex flex-column py-5',
          HomeStyles.contentAbout
        )}
      >
        <Row>
          <Col>
            <Container>
              <Row
                className={classNames(
                  'd-flex align-items-center text-center text-lg-start gap-3'
                )}
              >
                <Col xs={12} lg="auto">
                  <ShowOnScroll>
                    <Image src="/images/figure-1.png" alt="" fluid />
                  </ShowOnScroll>
                </Col>
                <Col className="gy-5">
                  <div className={classNames(HomeStyles.sectionContentSmall)}>
                    {capitalizeText(
                      t`sections:home.fragments.emphasisTitles.aboutUs.title.regular`,
                      'simple'
                    )}{' '}
                    <span className="text-info">
                      {t`sections:home.fragments.emphasisTitles.aboutUs.title.emphasis`}
                    </span>
                  </div>
                  <p className="text-shadow my-4 fs-6">
                    {capitalizeText(
                      t`sections:home.fragments.emphasisTitles.aboutUs.subtitle`,
                      'simple'
                    )}
                  </p>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container
        fluid
        className={classNames(
          'd-flex flex-column py-5',
          HomeStyles.contentApproach
        )}
      >
        <Row>
          <Col>
            <Container className="py-5">
              <Row
                className={classNames(
                  'd-flex align-items-center justify-content-around gap-3 py-5',
                  'text-center text-lg-start'
                )}
              >
                <Col className="order-2 order-lg-1 gy-5" xs={12} lg>
                  <h1 className={classNames(HomeStyles.sectionContentNegative)}>
                    {capitalizeText(
                      t`sections:home.fragments.emphasisTitles.modules.title.regular`,
                      'simple'
                    )}{' '}
                    <span className="text-info">
                      {t`sections:home.fragments.emphasisTitles.modules.title.emphasis`}
                    </span>
                  </h1>
                  <p className="text-shadow">
                    {capitalizeText(
                      t`sections:home.fragments.emphasisTitles.modules.subtitle`,
                      'simple'
                    )}
                  </p>
                  <Link
                    href={cybersecurityLinks.at(0)!.subLinks!.at(0)!.href!}
                    passHref
                  >
                    <Button className="rounded-pill text-light">
                      {capitalizeText(t`common:learnMore`, 'simple')}
                    </Button>
                  </Link>
                </Col>
                <Col xs={12} lg className="order-1 order-lg-2">
                  <ShowOnScroll direction="left">
                    <Image src="/images/figure-2.png" alt="" fluid />
                  </ShowOnScroll>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container
        fluid
        className={classNames(
          'd-flex flex-column py-5',
          HomeStyles.contentServices
        )}
      >
        <Row className="pb-5">
          <Col className="pb-5">
            <Container className="pb-5">
              <Row className="text-center mb-5">
                <Col>
                  <h1 className={HomeStyles.sectionContentNegative}>
                    {capitalizeText(
                      t`sections:home.fragments.services.title.regular`,
                      'simple'
                    )}{' '}
                    <span className="text-info">
                      {t`sections:home.fragments.services.title.emphasis`}
                    </span>
                  </h1>
                </Col>
              </Row>
              <Row className="gy-4">
                {services.map(({ icon, title, description }, key) => (
                  <Col
                    key={key}
                    xs={12}
                    md={6}
                    lg={4}
                    className="align-self-stretch"
                  >
                    <div
                      className={classNames(
                        'h-100 p-5 rounded-4 text-center',
                        'bg-opacity-75 bg-light-gray text-dark-blue',
                        HomeStyles.serviceBox
                      )}
                    >
                      <h1>
                        <FontAwesomeIcon icon={icon} />
                      </h1>
                      <h4>{capitalizeText(t(title))}</h4>
                      <p>{capitalizeText(t(description), 'simple')}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container className="d-flex flex-column gap-5 mb-5 py-5">
        <Row>
          <Col className="text-center">
            <h1 className={HomeStyles.sectionContent}>
              {capitalizeText(t`sections:contact.form.title`, 'simple')}
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <DynamicContactForm />
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

export default Home
