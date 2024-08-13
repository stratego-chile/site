import type { LinkSpec } from '@stratego/data/navigation-links'
import Link, { type LinkProps } from 'next/link'

type NavBarLinkProps = Partial<LinkProps> & {
  link: LinkSpec
  className?: string
}

const NavBarLink: React.FC<React.PropsWithChildren<NavBarLinkProps>> = ({
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

export default NavBarLink
