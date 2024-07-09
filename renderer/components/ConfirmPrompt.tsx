import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";

interface ConfirmPromptProps {
  message: string;
  isShowing: boolean;
  hide: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmPrompt({
  isShowing,
  onConfirm,
  onCancel,
  message,
}: ConfirmPromptProps) {
  return (
    <Modal
      size="sm"
      placement="center"
      isDismissable={false}
      isOpen={isShowing}
      onClose={onCancel}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody className="pt-5 pb-5">{message}</ModalBody>
        <ModalFooter>
          <Button size="sm" color="primary" onPress={onConfirm}>
            Xác nhận
          </Button>
          <Button size="sm" color="danger" onPress={onCancel}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
