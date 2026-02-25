import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Tooltip,
    User,
    Link,
    ScrollShadow,
} from "@heroui/react";
import { ImageCarousel } from "./imageCarousel";
import { randomEvents } from "@/config/site";
import { PostData } from "@/config/apiClient";
import { CalendarIcon } from "./icons";

export const EventDrawer = ({ isOpen, onOpenChange, cardProps = randomEvents[0] }: { isOpen: boolean, onOpenChange: (open: boolean) => void, cardProps: PostData }) => {
    const { dates, images, ownerUsername, caption, ownerFullName, ownerProfilePicUrl } = cardProps;
    const eventDates = Array.isArray(dates) ? dates : [];

    const allDates = eventDates.map(date => {
        // only show the dates that are in the future or today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(date);
        eventDate.setHours(0, 0, 0, 0);
        if (eventDate < today) {
            return null;
        }
        const dayName = new Date(date).toLocaleDateString("es-MX", { weekday: "long" });
        const formattedDate = new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
        return `${dayName}, ${formattedDate}`;
    }).join("|");

    return (
        <Drawer
            hideCloseButton
            backdrop="blur"
            classNames={{
                base: "sm:data-[placement=right]:m-4 xs:data-[placement=right]:m-10 sm:data-[placement=left]:m-2 rounded-medium",
            }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
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
                            <div className="w-full flex justify-end gap-2">
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
                                    as={Link}
                                    href={cardProps.url}
                                >
                                    Página del evento
                                </Button>
                            </div>
                        </DrawerHeader>
                        <DrawerBody className="pt-16">
                            <div className="flex w-full justify-center items-center pt-4">
                                <ImageCarousel images={[...images ? [images, images] : []].flat()} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className=" flex flex-col gap-3">
                                    <ScrollShadow hideScrollBar className="w-full h-max-[100px]">
                                        {
                                            allDates.split("|").map((date, index) => (
                                                <p key={index} className="text-small text-foreground-500 font-medium">
                                                    <CalendarIcon className="inline mr-1" /> {date}
                                                </p>
                                            ))
                                        }
                                    </ScrollShadow>

                                    <div className="flex flex-col mt-2 gap-3 items-start">
                                        <span className="text-medium font-medium">Acerca de este evento</span>
                                        <div className="text-medium text-default-500 flex flex-col gap-2">
                                            <p>{caption}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DrawerBody>
                        <DrawerFooter className="flex flex-col gap-1 border-t border-default-200/50 bg-content2">
                            <User name={ownerFullName} description={"@" + ownerUsername} avatarProps={{ src: ownerProfilePicUrl }} />
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>

    );
}
