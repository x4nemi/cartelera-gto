import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React from 'react'

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
                            <Button color="danger" variant="light" className='rounded-2xl' onPress={onCancel}>
                                Sí, cancelar
                            </Button>
                            <Button color="primary" className='rounded-2xl' onPress={onClose}>
                                No
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
