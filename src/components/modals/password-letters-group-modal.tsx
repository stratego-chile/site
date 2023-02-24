import PasswordGeneratorLettersGroupForm from '@stratego/components/forms/password-letters-group-form'
import PropTypes from 'prop-types'
import { type FC } from 'react'
import Modal from 'react-bootstrap/Modal'

type PasswordGeneratorLettersGroupModalProps = {
  show?: boolean
  lettersGroupSpec: Stratego.Utils.PasswordGenerator.LettersGroupSpec
  onLettersGroupSpecChange?: (
    lettersGroupSpec: Stratego.Utils.PasswordGenerator.LettersGroupSpec
  ) => void
  onCancel?: () => void
}

const PasswordGeneratorLettersGroupModal: FC<
  PasswordGeneratorLettersGroupModalProps
> = ({
  onCancel,
  lettersGroupSpec,
  onLettersGroupSpecChange,
  show = false,
}) => {
  return (
    <Modal show={show} keyboard={false} centered>
      <Modal.Body>
        <PasswordGeneratorLettersGroupForm
          lettersGroupSpec={lettersGroupSpec}
          onLettersGroupSpecChange={onLettersGroupSpecChange}
          onCancel={onCancel}
        />
      </Modal.Body>
    </Modal>
  )
}

PasswordGeneratorLettersGroupModal.displayName =
  'PasswordGeneratorLettersGroupModal'

PasswordGeneratorLettersGroupModal.propTypes = {
  lettersGroupSpec: PropTypes.shape({
    name: PropTypes.string
      .isRequired as PropTypes.Validator<Stratego.Utils.PasswordGenerator.LettersGroup>,
    letters: PropTypes.string.isRequired,
    range: PropTypes.string.isRequired,
  }).isRequired,
  onLettersGroupSpecChange: PropTypes.func,
  show: PropTypes.bool,
}

PasswordGeneratorLettersGroupModal.defaultProps = {
  show: false,
}

export default PasswordGeneratorLettersGroupModal
