import NavBarLink from '@stratego/components/misc/navbar-link'
import { type LinkSpec } from '@stratego/data/navigation-links'
import { recursiveCall } from '@stratego/helpers/functions.helper'
import { capitalizeText } from '@stratego/helpers/text.helper'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { Fragment, useId, type FC } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

type NavBarLinksProps = {
  links?: Array<LinkSpec>
  mode?: 'root' | 'embed'
}

const NavBarLinks: FC<NavBarLinksProps> = ({ links = [], mode = 'root' }) => {
  const togglerId = useId()

  const { t } = useTranslation()

  return (
    <Fragment>
      {links.map((link, key) => (
        <Fragment key={key}>
          {link.subLinks ? (
            link.label ? (
              <Fragment>
                <Dropdown.Header
                  className={classNames(
                    'd-flex align-items-center py-1',
                    'fw-bold'
                  )}
                >
                  {capitalizeText(t(link.text).toLowerCase(), 'simple')}
                </Dropdown.Header>
                <NavBarLinks links={link.subLinks} mode="embed" />
                {links.reduce(
                  (counter, linkSpec) =>
                    !linkSpec.href && !linkSpec.subLinks ? ++counter : counter,
                  0
                ) > 1 && <Dropdown.Divider />}
              </Fragment>
            ) : (
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
    </Fragment>
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
}

NavBarLinks.defaultProps = {
  links: [],
  mode: 'root',
}

NavBarLinks.displayName = 'NavBarLinks'

export default NavBarLinks
