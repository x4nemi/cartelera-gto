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
        <Modal backdrop='blur' placement="center" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} closeButton={false} className="w-fit max-w-[95vw] max-h-[95vh] m-4">
            <ModalContent className="rounded-3xl">
                <ModalBody className="my-5 flex flex-col -mb-1">
                    <div className="shrink-0 self-center">
                        <Image
                            removeWrapper
                            alt="Card example background"
                            className="max-h-[75vh] rounded-lg rounded-b-none"
                            src={props.image}
                        />
                    </div>
                    <div className="flex flex-col self-center w-full -mt-3 mb-5">
                        <Alert variant="bordered" startContent={
                            <User
                                avatarProps={{
                                    src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                                    className: "w-12 h-12"
                                }}
                                description="@username"
                                name="Jane Doe"
                            />
                        } endContent={<div className="gap-2 flex flex-wrap justify-end">
                            {props.user?.location &&
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
                        </div>} hideIcon className="rounded-b-none"/>
                        <Alert hideIcon title="Detalles del evento" variant="faded" description={props.description || "Sin descripción disponible."} className="rounded-t-none"/>
                    </div>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}
