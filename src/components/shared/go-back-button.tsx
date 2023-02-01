import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { capitalizeText } from '@stratego/helpers/text.helper'
import { useRouter } from 'next/router'
import { type FC } from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'next-i18next'

type GoBackButtonProps = {
  variant?: string
}

const GoBackButton: FC<GoBackButtonProps> = ({
  variant = 'outline-dark-blue',
}) => {
  const router = useRouter()

  const { t } = useTranslation()

  return (
    <Button
      className="mx-auto rounded-pill text-decoration-none"
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

export default GoBackButton
