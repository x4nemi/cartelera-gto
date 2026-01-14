import { Alert, Button, Link, Modal, ModalBody, ModalContent, ModalFooter, User } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { FBIcon, GlobeIcon, IgIcon, MapPinIcon, WAIcon } from "./icons";
import { ImageCarousel } from "./imageCarousel";

const animatedClasses = "transition-all duration-200 ease-in-out hover:-translate-y-1";

export const EventModal = ({ props, isOpen, onClose = () => { } }: { props: EventCardProps, isOpen: boolean, onClose: () => void }) => {

    const socialLinks = props.user?.socialLinks;

    const SocialIcons = {
        instagram: IgIcon,
        facebook: FBIcon,
        whatsapp: WAIcon,
        website: GlobeIcon
    }
    return (
        <Modal backdrop='blur' placement="center" scrollBehavior="inside" isOpen={isOpen} onClose={onClose} closeButton={false} className="w-fit lg:max-w-[50vw] max-w-[95vw] max-h-[95vh] m-4">
            <ModalContent className="rounded-3xl">
                <ModalBody className="my-5 flex flex-col -mb-1 gap-1 items-center">
                    <div className="shrink-0 w-full flex justify-center">
                        <ImageCarousel images={[...props.image ? [props.image, props.image] : []].flat()} className="max-h-[75vh] rounded-xl" />
                    </div>
                    <div className="flex flex-col w-full mb-5">
                        <Alert variant="bordered" startContent={
                            <User
                                avatarProps={{
                                    src: props.user?.avatarUrl || "/default-avatar.png",
                                    className: "w-12 h-12"
                                }}
                                // description={"@" + (props.username || "janedoe")}
                                name={props.user?.name || "Jane Doe"}
                            />
                        } endContent={<div className="gap-1 flex flex-wrap justify-end">
                            {props.user?.location &&
                                <Button
                                    startContent={<MapPinIcon size={24} />}
                                    isIconOnly size="lg" color="secondary" variant="flat" className={animatedClasses}
                                    aria-label="Ver ubicación"
                                ></Button>
                            }
                            {
                                socialLinks && Object.entries(socialLinks).map(([key, value]) => {
                                    const IconComponent = SocialIcons[key as keyof typeof SocialIcons];
                                    return value ? (
                                        <Button
                                            key={key}
                                            color="secondary"
                                            as={Link}
                                            size="lg"
                                            variant="flat"
                                            isIconOnly
                                            aria-label={key}
                                            startContent={<IconComponent size={24} />}
                                            href={value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={animatedClasses}
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
