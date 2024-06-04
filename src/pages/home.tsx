import { capitalizeText } from '@stratego/helpers/text.helper'
import { defaultLocale } from '@stratego/locales'
import HomeStyles from '@stratego/styles/modules/Home.module.sass'
import classNames from 'classnames'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { Accordion } from 'react-bootstrap'
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

const Image = dynamic(() => import('react-bootstrap/Image'))

const ShowOnScroll = dynamic(
  () => import('@stratego/components/animations/show-on-scroll')
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
                <Col className="text-lg-start order-lg-1 order-2 text-center">
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

                  <p className="text-shadow fs-5 my-4">
                    {capitalizeText(
                      t`sections:home.fragments.emphasisTitles.presentation.subtitle`,
                      'simple'
                    )}
                  </p>
                </Col>

                <Col xs={12} lg="auto" className="order-lg-2 order-1">
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
                  'd-flex align-items-center text-lg-start gap-3 text-center'
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

                  <ul className="mt-5">
                    {[
                      'Protección de reputación y marca de su empresa',
                      'Asegurar su continuidad operacional',
                      'Proteger activos estratégicos: inventarios, cuentas por cobrar, activos financieros, tecnológicos etc.​',
                      'Protección de datos de clientes​',
                      'Cumplir con la Ley 21.459 sobre Delitos Informáticos​',
                      'Cumplir las regulaciones de ciber-seguridad (Ley 21.663)',
                      'Protección y capacitación de sus trabajadores​',
                    ].map((item, index) => (
                      <li key={index} className="px-0 py-2 fs-5">
                        {item}
                      </li>
                    ))}
                  </ul>
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
                  'text-lg-start text-center'
                )}
              >
                <Col className="order-lg-1 gy-5 order-2" xs={12} lg>
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
                </Col>

                <Col xs={12} lg className="order-lg-2 order-1">
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
              <Row className="mb-5 text-center">
                <Col>
                  <h1
                    className={classNames(
                      HomeStyles.sectionContentNegative,
                      'd-inline-flex justify-items-center gap-3'
                    )}
                  >
                    <span>Nuestros planes de</span>

                    <span className="text-info">servicio</span>
                  </h1>
                </Col>
              </Row>

              <Row className="gy-4">
                <Col xs={12} className="align-self-stretch">
                  <section
                    className={classNames(
                      'd-flex flex-column gap-5 p-5 rounded-4',
                      'bg-light-gray bg-opacity-75 service-box',
                      HomeStyles.serviceBox
                    )}
                  >
                    <h1>
                      Plan de auditoría se seguridad <b>One Time</b>
                    </h1>

                    <div className="row d-flex gap-4 fs-5">
                      <div className="col d-flex flex-column gap-4">
                        <p>
                          El programa de auditoría ciberseguridad lo hemos
                          desarrollado bajo estándares internacionales de
                          identificación y evaluación de riesgos informáticos.
                        </p>

                        <p>
                          Nuestra colaboración profesional permitirá desarrollar
                          una evaluación orientada a detectar vulnerabilidades o
                          áreas débiles que estén expuestas al Ciber Ataque.​
                        </p>

                        <h3>¿Cómo lo hacemos?</h3>

                        <p>
                          Nuestro Servicio se realiza mediante análisis remotos
                          utilizando nuestra máquina de análisis instalada en
                          las oficinas de los clientes, y un trabajo de campo.
                          Con el resultado de la evaluación diagnóstica,
                          entregamos una evaluación exhaustiva de los riesgos en
                          la infraestructura digital y sus procesos de seguridad
                          de la información.
                        </p>
                      </div>

                      <div className={classNames('col')}>
                        <Accordion
                          defaultActiveKey={['0', '1']}
                          alwaysOpen
                          className="service-accordion"
                        >
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              ¿Qué evaluaremos?
                            </Accordion.Header>

                            <Accordion.Body>
                              <ul>
                                {[
                                  'Políticas de Ciberseguridad',
                                  'Procedimientos y Controles de Protección',
                                  'Cumplimientos Normativos',
                                  'Análisis de Vulnerabilidades',
                                  'Riesgos  Tecnológicos',
                                ].map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              ¿Qué entregaremos?
                            </Accordion.Header>

                            <Accordion.Body>
                              <ul>
                                {[
                                  'Informe de Riesgo de Cumplimiento',
                                  'Propuesta de mitigación de Riesgos',
                                  'Propuesta de Planes de Continuidad del Negocio',
                                ].map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    </div>
                  </section>
                </Col>

                <Col xs={12} className="align-self-stretch">
                  <div
                    className={classNames(
                      'd-flex flex-column gap-5 p-5 rounded-4',
                      'bg-light-gray bg-opacity-75 service-box',
                      HomeStyles.serviceBox
                    )}
                  >
                    <h1>
                      Plan de auditoría <b>Continua</b>
                    </h1>

                    <div className="row d-flex gap-4 fs-5">
                      <div className="col d-flex flex-column gap-4">
                        <p>
                          Los ataques de ransomware aprovechan las
                          vulnerabilidades mediante phishing o exploits de
                          software, cifran datos valiosos y exigen un rescate.
                          Incidentes de alto perfil han afectado a empresas y
                          particulares en todo el mundo.
                        </p>

                        <p>
                          Nuestra solución en tiempo real es vital para prevenir
                          las infecciones por ransomware, ya que detectan y
                          neutralizan el software malicioso, protegen los
                          endpoints y minimizan la superficie de ataque de las
                          ciber amenazas potenciales.
                        </p>

                        <p>La cobertura del servicio es 24/7</p>
                      </div>

                      <div className={classNames('col')}>
                        <Accordion
                          defaultActiveKey="0"
                          alwaysOpen
                          className="service-accordion"
                        >
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              Características del servicio
                            </Accordion.Header>

                            <Accordion.Body>
                              <ul>
                                {[
                                  'Visibilidad Integral: Ofrecemos una visibilidad completa de su infraestructura de TI, lo que facilita la identificación de vulnerabilidades y la toma de decisiones informadas.',
                                  'Análisis Profundo de Datos: Nuestra plataforma de análisis le permite explorar y analizar datos de seguridad para detectar patrones, anomalías y amenazas ocultas, brindándole información crucial para fortalecer su postura de seguridad.',
                                  'Monitoreo en Sitio: Instalamos un equipo de monitoreo avanzado en sus instalaciones para una vigilancia en tiempo real y una respuesta rápida ante cualquier amenaza.',
                                  'Integración sin Problemas: Nuestra solución se integra perfectamente con sus sistemas existentes, lo que simplifica la implementación y la gestión de la seguridad.',
                                  'Asesoría Especializada: Nuestros expertos en seguridad están disponibles para discutir los resultados y ayudarle a tomar medidas precisas para proteger su empresa.',
                                ].map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
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
