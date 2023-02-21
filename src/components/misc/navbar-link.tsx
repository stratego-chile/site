import { type LinkSpec } from '@stratego/data/navigation-links'
import Link, { LinkProps } from 'next/link'
import { PropsWithChildren, type FC } from 'react'

const NavBarLink: FC<
  PropsWithChildren<
    Partial<LinkProps> & {
      link: LinkSpec
    }
  >
> = ({ link, children, ...linkProps }) => {
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

export default NavBarLink
