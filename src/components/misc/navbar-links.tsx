import NavBarLink from '@stratego/components/misc/navbar-link'
import { type LinkSpec } from '@stratego/data/navigation-links'
import { recursiveCall } from '@stratego/helpers/functions.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { Fragment, type PropsWithChildren, useId, type FC } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

type NavBarLinksProps = {
  links?: Array<LinkSpec>
  mode?: 'root' | 'embed'
  orientation?: 'vertical' | 'horizontal'
}

const NavBarLinks: FC<NavBarLinksProps> = ({
  links = [],
  mode = 'root',
  orientation = 'horizontal',
}) => {
  const togglerId = useId()

  const { t } = useTranslation()

  const Wrapper: FC<PropsWithChildren<WithoutProps>> = (props) => {
    return orientation === 'vertical' ? (
      <div
        {...props}
        className={classNames(
          'd-flex flex-column',
          'align-items-start justify-content-start',
          'w-100 fw-bold gap-4 py-2 px-0'
        )}
      />
    ) : (
      <Fragment {...props} />
    )
  }

  return (
    <Wrapper>
      {links.map((link, key) => (
        <Fragment key={key}>
          {link.subLinks ? (
            link.label ? (
              <Fragment>
                {orientation === 'horizontal' ? (
                  <Dropdown.Header
                    className={classNames(
                      'd-flex align-items-center py-1',
                      'fw-bold'
                    )}
                  >
                    {capitalizeText(t(link.text).toLowerCase(), 'simple')}
                  </Dropdown.Header>
                ) : (
                  <span className="fw-normal mb-n2 mt-2">
                    {capitalizeText(t(link.text).toLowerCase(), 'simple')}:
                  </span>
                )}
                <NavBarLinks
                  links={link.subLinks}
                  mode="embed"
                  orientation={orientation}
                />
                {links.reduce(
                  (counter, linkSpec) =>
                    !linkSpec.href && !linkSpec.subLinks ? ++counter : counter,
                  0
                ) > 1 && <Dropdown.Divider />}
              </Fragment>
            ) : orientation === 'horizontal' ? (
              <Dropdown
                navbar
                align="start"
                drop={mode === 'embed' ? 'end' : undefined}
                className={classNames(mode === 'embed' && 'px-xl-2 px-3')}
              >
                <Dropdown.Toggle
                  as={Nav.Link}
                  id={togglerId}
                  className={classNames(mode === 'embed' && 'text-dark')}
                  style={{
                    fontWeight: mode === 'embed' ? 500 : 600,
                    fontSize: mode === 'embed' ? '0.85em' : 'inherit',
                  }}
                  disabled={!!link.disabled}
                >
                  {mode === 'root'
                    ? capitalizeText(t(link.text).toLowerCase(), 'simple')
                    : t(link.text)}
                </Dropdown.Toggle>
                <Dropdown.Menu renderOnMount>
                  {link.subLinks.map((subLink, subLinkKey) =>
                    subLink.href ? (
                      <NavBarLink
                        key={subLinkKey}
                        link={subLink}
                        passHref
                        legacyBehavior
                        scroll={false}
                      >
                        <Dropdown.Item
                          style={{
                            fontSize: '0.85em',
                          }}
                          disabled={!!subLink.disabled}
                        >
                          {t(subLink.text)}
                        </Dropdown.Item>
                      </NavBarLink>
                    ) : (
                      <Fragment key={subLinkKey}>
                        <NavBarLinks links={[subLink]} mode="embed" />
                      </Fragment>
                    )
                  )}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Accordion
                className="d-flex flex-column w-100 justify-content-between my-0 border-0 p-0"
                flush
                alwaysOpen
              >
                <Accordion.Item eventKey={String(key)} className="">
                  <Accordion.Button
                    className={classNames(
                      'd-flex justify-content-between border-0 p-0',
                      'fw-bold text-dark box-shadow-none bg-transparent'
                    )}
                  >
                    {mode === 'root'
                      ? capitalizeText(t(link.text).toLowerCase(), 'simple')
                      : t(link.text)}
                  </Accordion.Button>
                  <Accordion.Body className="ps-2 pe-0 py-0">
                    {link.subLinks.map((subLink, subLinkKey) =>
                      subLink.href ? (
                        <NavBarLink
                          key={subLinkKey}
                          link={subLink}
                          scroll={false}
                          className={classNames(
                            'd-flex flex-column justify-content-between border-0 px-0 py-3',
                            'text-secondary text-decoration-none my-2'
                          )}
                        >
                          {t(subLink.text)}
                        </NavBarLink>
                      ) : (
                        <Fragment key={subLinkKey}>
                          <NavBarLinks
                            links={[subLink]}
                            mode="embed"
                            orientation={orientation}
                          />
                        </Fragment>
                      )
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )
          ) : link.href ? (
            <NavBarLink link={link} passHref legacyBehavior scroll={false}>
              <Nav.Link as="a" disabled={!!link.disabled}>
                {capitalizeText(t(link.text).toLowerCase(), 'simple')}
              </Nav.Link>
            </NavBarLink>
          ) : (
            <Navbar.Text>
              {capitalizeText(t(link.text).toLowerCase(), 'simple')}
            </Navbar.Text>
          )}
        </Fragment>
      ))}
    </Wrapper>
  )
}

export const lazySubLink = recursiveCall(function () {
  return PropTypes.shape({
    text: PropTypes.string.isRequired,
    label: PropTypes.string,
    href: PropTypes.string,
    disabled: PropTypes.bool,
    subLinks: lazySubLink,
    dynamicPath: PropTypes.bool,
    dynamicTemplatePath: PropTypes.string,
  })
})

NavBarLinks.propTypes = {
  links: PropTypes.arrayOf(lazySubLink),
  mode: PropTypes.oneOf(['root', 'embed']),
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
}

NavBarLinks.defaultProps = {
  links: [],
  mode: 'root',
  orientation: 'horizontal',
}

NavBarLinks.displayName = 'NavBarLinks'

export default NavBarLinks
