import { Button } from "@/compat/heroui";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/compat/heroui"

export const CancelModal = ({ openModal, setOpenModal, onCancel }: { openModal: boolean; setOpenModal: (open: boolean) => void; onCancel: () => void }) => {
    return (
        <Modal isOpen={openModal} backdrop='blur' onOpenChange={setOpenModal} className='rounded-3xl'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="gap-1">¿Estás seguro?</ModalHeader>
                        <ModalBody>
                            Si cancelas, se perderán los datos ingresados.
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="tertiary" className='rounded-2xl' onPress={onCancel}>
                                Sí, cancelar
                            </Button>
                            <Button color="accent" className='rounded-2xl' onPress={onClose}>
                                No
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
