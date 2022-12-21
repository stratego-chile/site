import Layout from '@stratego/components/utils/layout'
import { defaultLocale } from '@stratego/locale.middleware'
import classNames from 'classnames'
import { type GetServerSideProps, type NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import HomeStyles from '@stratego/styles/modules/Home.module.sass'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { advantages, services } from '@stratego/data/home-content'

const defaultFigureHeight = '34rem'

const Home: NextPage<WithoutProps> = () => {
  const { t } = useTranslation('sections')

  return (
    <Layout
      pageTitle={capitalizeText(t('sections:home.title') satisfies string)}
      showNavigationOptions
      className={classNames('d-flex flex-column', HomeStyles.homeWrapper)}
    >
      <Container
        fluid
        className={classNames(HomeStyles.banner, 'd-flex flex-grow-1')}
      >
        <Row className={classNames('d-flex flex-grow-1')}>
          <Col
            className={classNames(
              'd-flex flex-column flex-grow-1 align-self-stretch',
              'align-items-center justify-content-center justify-content-lg-start'
            )}
          >
            <Container
              className={classNames(
                'd-flex flex-column flex-grow-1 align-self-stretch align-content-center'
              )}
            >
              <Row className="d-flex flex-grow-1 align-items-center">
                <Col className="text-center text-lg-start">
                  <h1 className={classNames(HomeStyles.sectionContent)}>
                    <span className="fs-2 d-none d-lg-inline">
                      {capitalizeText(
                        t(
                          'sections:home.fragments.emphasisTitles.presentation.appendix'
                        ),
                        'simple'
                      )}
                    </span>
                    <br />
                    {capitalizeText(
                      t(
                        'sections:home.fragments.emphasisTitles.presentation.title.regular'
                      ),
                      'simple'
                    )}
                    <span className="text-info">
                      {capitalizeText(
                        t(
                          'sections:home.fragments.emphasisTitles.presentation.title.emphasis'
                        ),
                        'simple'
                      )}
                    </span>
                  </h1>
                  <p className="text-shadow">
                    {capitalizeText(
                      t(
                        'sections:home.fragments.emphasisTitles.presentation.subtitle'
                      ),
                      'simple'
                    )}
                  </p>
                  <Link href="/security/services" passHref>
                    <Button variant="dark-blue" className="rounded-pill">
                      {capitalizeText(t('common:learnMore'), 'simple')}
                    </Button>
                  </Link>
                </Col>
                <Col xs={12} lg="auto">
                  <Image
                    src="/images/figure-0.png"
                    style={{
                      width: defaultFigureHeight,
                    }}
                    alt=""
                    fluid
                  />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col
            className={classNames(
              'd-flex flex-column flex-lg-row p-5 mx-3 mx-lg-0 mt-5 gap-3',
              'rounded-4 bg-dark-blue text-center text-lg-start fs-5 fw-normal'
            )}
          >
            {advantages.map((section, key) => (
              <Col
                xs={12}
                lg
                className={classNames(
                  'd-flex flex-column flex-lg-row',
                  'gap-3 p-3',
                  'rounded-4 overflow-hidden',
                  HomeStyles.floatingBox
                )}
                key={key}
              >
                <div className="fs-1">
                  <FontAwesomeIcon icon={section.icon} />
                </div>
                <div className="d-inline-flex flex-column">
                  <span className="fs-4 fw-bold">
                    {capitalizeText(t(section.title))}
                  </span>
                  <span className="fs-6">
                    {capitalizeText(t(section.description), 'simple')}
                  </span>
                </div>
              </Col>
            ))}
          </Col>
        </Row>
      </Container>
      <Container
        fluid
        className={classNames(
          'd-flex flex-column gap-5 py-5',
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
                  <Image src="/images/figure-1.png" alt="" fluid />
                </Col>
                <Col className="gy-5">
                  <h1 className={classNames(HomeStyles.sectionContent)}>
                    <span className="fs-2">
                      {capitalizeText(
                        t(
                          'sections:home.fragments.emphasisTitles.aboutUs.appendix'
                        ),
                        'simple'
                      )}
                    </span>
                    <br />
                    {capitalizeText(
                      t(
                        'sections:home.fragments.emphasisTitles.aboutUs.title.regular'
                      ),
                      'simple'
                    )}{' '}
                    <span className="text-info">
                      {t(
                        'sections:home.fragments.emphasisTitles.aboutUs.title.emphasis'
                      )}
                    </span>
                  </h1>
                  <p className="text-shadow">
                    {capitalizeText(
                      t(
                        'sections:home.fragments.emphasisTitles.aboutUs.subtitle'
                      ),
                      'simple'
                    )}
                  </p>
                  <Link href="/security/overview" passHref>
                    <Button
                      variant="info"
                      className="rounded-pill text-deep-dark-blue"
                    >
                      {capitalizeText(t('common:learnMore'), 'simple')}
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container
        fluid
        className={classNames(
          'd-flex flex-column gap-5 py-5',
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
                    <span className="fs-2">
                      {capitalizeText(
                        t(
                          'sections:home.fragments.emphasisTitles.modules.appendix'
                        ),
                        'simple'
                      )}
                    </span>
                    <br />
                    {capitalizeText(
                      t(
                        'sections:home.fragments.emphasisTitles.modules.title.regular'
                      ),
                      'simple'
                    )}{' '}
                    <span className="text-info">
                      {t(
                        'sections:home.fragments.emphasisTitles.modules.title.emphasis'
                      )}
                    </span>
                  </h1>
                  <p className="text-shadow">
                    {capitalizeText(
                      t(
                        'sections:home.fragments.emphasisTitles.modules.subtitle'
                      ),
                      'simple'
                    )}
                  </p>
                  <Link href="/security/services" passHref>
                    <Button className="rounded-pill text-light">
                      {capitalizeText(t('common:learnMore'), 'simple')}
                    </Button>
                  </Link>
                </Col>
                <Col xs={12} lg className="order-1 order-lg-2">
                  <Image src="/images/figure-2.png" alt="" fluid />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container
        fluid
        className={classNames(
          'd-flex flex-column gap-5 py-5',
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
                      t('sections:home.fragments.services.title.regular'),
                      'simple'
                    )}{' '}
                    <span className="text-info">
                      {t('sections:home.fragments.services.title.emphasis')}
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
                        'h-100 p-5 rounded-4 bg-opacity-75 bg-light-gray',
                        'text-center text-dark-blue',
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
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<WithoutProps> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? defaultLocale, [
      'common',
      'sections',
    ])),
  },
})

export default Home
