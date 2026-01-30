import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Link,
    Tooltip,
    Avatar,
    AvatarGroup,
    User,
} from "@heroui/react";
import { ImageCarousel } from "./imageCarousel";
import { EventCardProps } from "./interfaces";
import { randomEvents } from "@/config/site";

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export const EventDrawer = ({ isOpen, onOpenChange, cardProps = randomEvents[0] }: { isOpen: boolean, onOpenChange: (open: boolean) => void, cardProps: EventCardProps }) => {
    const { id, title, date, hour, image, username, description, user } = cardProps;
    const { socialLinks } = user || {};
    const dayName = new Date(date).toLocaleDateString('es-MX', { weekday: 'long' });
    const formattedDate = new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        <Drawer
            hideCloseButton
            backdrop="blur"
            classNames={{
                base: "sm:data-[placement=right]:m-4 xs:data-[placement=right]:m-10 sm:data-[placement=left]:m-2 rounded-medium",
            }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="sm"
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                            <Tooltip content="Cerrar">
                                <Button
                                    isIconOnly
                                    className="text-default-400"
                                    size="sm"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    <svg
                                        fill="none"
                                        height="20"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                                    </svg>
                                </Button>
                            </Tooltip>
                            <div className="w-full flex justify-start gap-2">
                                <Button
                                    className="font-medium text-small text-default-500"
                                    endContent={
                                        <svg
                                            fill="none"
                                            height="16"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M7 17 17 7M7 7h10v10" />
                                        </svg>
                                    }
                                    size="sm"
                                    variant="flat"
                                >
                                    Página del evento
                                </Button>
                            </div>
                            <div className="flex gap-1 items-center">
                                <Tooltip content="Anterior">
                                    <Button isIconOnly className="text-default-500" size="sm" variant="flat">
                                        <svg
                                            fill="none"
                                            height="16"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="m18 15-6-6-6 6" />
                                        </svg>
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Siguiente">
                                    <Button isIconOnly className="text-default-500" size="sm" variant="flat">
                                        <svg
                                            fill="none"
                                            height="16"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </Button>
                                </Tooltip>
                            </div>
                        </DrawerHeader>
                        <DrawerBody className="pt-16">
                            <div className="flex w-full justify-center items-center pt-4">
                                <ImageCarousel images={[...image ? [image, image] : []].flat()} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className=" flex flex-col gap-3">
                                    <div className="flex gap-3 items-center">
                                        <div className="flex-none border-1 border-default-200/50 rounded-small text-center w-11 overflow-hidden">
                                            <div className="text-tiny bg-default-100 py-0.5 text-default-500">{months[new Date(date).getMonth()]}</div>
                                            <div className="flex items-center justify-center font-semibold text-medium h-6 text-default-500">
                                                {new Date(date).getDate()}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-medium text-foreground font-medium">
                                                {dayName}, {formattedDate}
                                            </p>
                                            <p className="text-small text-default-500">{hour} hrs</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-4 gap-3 items-start">
                                        <span className="text-medium font-medium">Acerca de este evento</span>
                                        <div className="text-medium text-default-500 flex flex-col gap-2">
                                            <p>{description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DrawerBody>
                        <DrawerFooter className="flex flex-col gap-1 border-t border-default-200/50 bg-content2">
                            <User name={user?.name} description={user?.username} avatarProps={{src: user?.avatarUrl}} />
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>

    );
}
