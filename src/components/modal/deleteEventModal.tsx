import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'

export const DeleteEventModal = ({ isOpen, onOpenChange, onDelete }: { isOpen: boolean; onOpenChange: (open: boolean) => void; onDelete: () => void }) => {
    return (
        <Modal isOpen={isOpen} backdrop='blur' onOpenChange={onOpenChange} className='rounded-3xl'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="gap-1">¿Eliminar evento?</ModalHeader>
                        <ModalBody>
                            Esta acción no se puede deshacer. El evento será eliminado permanentemente.
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" className='rounded-2xl' onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button color="danger" className='rounded-2xl' onPress={() => { onDelete(); onClose(); }}>
                                Sí, eliminar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
