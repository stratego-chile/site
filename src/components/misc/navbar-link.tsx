import type { LinkSpec } from '@stratego/data/navigation-links'
import Link, { type LinkProps } from 'next/link'
import PropTypes from 'prop-types'
import { FC, PropsWithChildren } from 'react'

type NavBarLinkProps = Partial<LinkProps> & {
  link: LinkSpec
  className?: string
}

const NavBarLink: FC<PropsWithChildren<NavBarLinkProps>> = ({
  link,
  children,
  ...linkProps
}) => {
  return (
    <Link
      {...linkProps}
      href={
        linkProps.href ?? {
          pathname: link.dynamicPath ? link.dynamicTemplatePath : link.href,
          query:
            link.dynamicPath && link.queryParams ? link.queryParams : undefined,
        }
      }
      as={linkProps.as}
    >
      {children}
    </Link>
  )
}

NavBarLink.displayName = 'NavBarLink'

NavBarLink.propTypes = {
  link: PropTypes.object.isRequired as PropTypes.Validator<LinkSpec>,
}

export default NavBarLink
