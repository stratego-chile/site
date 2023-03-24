import NavBarLinks from '@stratego/components/misc/navbar-links'
import { navbarLinks } from '@stratego/data/navigation-links'
import { getAssetPath } from '@stratego/helpers/static-resources.helper'
import NavbarStyles from '@stratego/styles/modules/Navbar.module.sass'
import classNames from 'classnames'
import Image from 'react-bootstrap/Image'
import Offcanvas from 'react-bootstrap/Offcanvas'

type MobileSidebarProps = {
  show?: boolean
  onClose?: () => void
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  show = false,
  onClose,
}) => {
  return (
    <Offcanvas show={show} onHide={onClose} placement="end" className="pt-2">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Image
            className={classNames('d-block', NavbarStyles.brandImage)}
            src={getAssetPath('logo-colored-alt.svg')}
            alt={process.env.BRAND_NAME}
            fluid
          />
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <NavBarLinks links={navbarLinks} orientation="vertical" />
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default MobileSidebar
