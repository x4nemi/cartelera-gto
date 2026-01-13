import { Alert, Button, Image, Link, Modal, ModalBody, ModalContent, ModalFooter, User } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { FBIcon, GlobeIcon, IgIcon, MapPinIcon, WAIcon } from "./icons";

export const EventModal = ({ props, isOpen, onClose = () => { } }: { props: EventCardProps, isOpen: boolean, onClose: () => void }) => {

    const socialLinks = props.user?.socialLinks;

    const SocialIcons = {
        instagram: IgIcon,
        facebook: FBIcon,
        whatsapp: WAIcon,
        website: GlobeIcon
    }
    return (
        <Modal backdrop='blur' placement="center" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} closeButton={false} size="3xl" hideCloseButton>
            <ModalContent>
                <ModalBody className="mt-10 flex-col md:flex-row">
                    <Image
                        removeWrapper
                        alt="Card example background"
                        className="md:w-md w-full rounded-lg object-cover"
                        src={props.image}
                    />
                    <Alert variant="bordered" startContent={
                        <>
                            <User
                                avatarProps={{
                                    src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                                    className: "w-12 h-12"
                                }}
                                description="@username"
                                name="Jane Doe"
                            />
                        </>
                    } endContent={<div className="gap-3 flex justify-end">
                        { props.user?.location &&
                            <Button
                            startContent={<MapPinIcon size={24} />}
                            isIconOnly size="lg"
                        ></Button>
                        }
                        {
                            socialLinks && Object.entries(socialLinks).map(([key, value]) => {
                                const IconComponent = SocialIcons[key as keyof typeof SocialIcons];
                                return value ? (
                                    <Button
                                        key={key}
                                        color="default"
                                        as={Link}
                                        size="lg"
                                        isIconOnly
                                        startContent={<IconComponent size={24} />}
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ) : null;
                            })
                        }
                    </div>} className="mt-1" hideIcon />
                    <Alert hideIcon title="Detalles del evento" variant="faded" description={props.description || "Sin descripción disponible."} />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
