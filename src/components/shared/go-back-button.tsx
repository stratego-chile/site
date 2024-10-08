import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'

type GoBackButtonProps = {
  variant?: string
}

const GoBackButton: React.FC<GoBackButtonProps> = ({
  variant = 'outline-dark-blue',
}) => {
  const router = useRouter()

  const { t } = useTranslation()

  return (
    <Button
      className="rounded-pill text-decoration-none mx-auto"
      variant={variant}
      onClick={() => router.back()}
    >
      <span className="fs-6">
        <FontAwesomeIcon icon={faArrowLeft} fixedWidth size="1x" />
        &ensp;{capitalizeText(t`common:goBack`, 'simple')}
      </span>
    </Button>
  )
}

GoBackButton.displayName = 'GoBackButton'

export default GoBackButton
