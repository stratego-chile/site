import PasswordGeneratorLettersGroupForm from '@stratego/components/forms/password-letters-group-form'
import Modal from 'react-bootstrap/Modal'

type PasswordGeneratorLettersGroupModalProps = {
  show?: boolean
  lettersGroupSpec: Stratego.Utils.PasswordGenerator.LettersGroupSpec
  onLettersGroupSpecChange?: (
    lettersGroupSpec: Stratego.Utils.PasswordGenerator.LettersGroupSpec
  ) => void
  onCancel?: () => void
}

const PasswordGeneratorLettersGroupModal: React.FC<
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

export default PasswordGeneratorLettersGroupModal
