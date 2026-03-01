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
import { ImageCarousel } from "../imageCarousel";
import { randomEvents } from "@/config/site";
import { PostData } from "@/config/apiClient";
import { CalendarIcon } from "../icons";
import { useEffect, useState } from "react";

export const EventDrawer = ({ isOpen, onOpenChange, cardProps = randomEvents[0] }: { isOpen: boolean, onOpenChange: (open: boolean) => void, cardProps: PostData }) => {
    const { dates, images, ownerUsername, caption, ownerFullName, ownerProfilePicUrl } = cardProps;
    const [eventDates, setEventDates] = useState<string[]>([])

    const today = new Date();

    useEffect(() => {
        if (dates) {
            const sortedDates = dates
                .map(date => {
                    // Parse as local date to avoid UTC timezone shift
                    const [y, m, d] = date.split("-").map(Number);
                    return new Date(y, m - 1, d);
                })
                .sort((a, b) => a.getTime() - b.getTime())
                .map(date =>
                    date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short", year: "numeric" })
                );
            setEventDates(sortedDates);
        }
    }, [dates]);
    
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
                                    target="_blank"
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
                                    {eventDates.length > 0 && (
                                        <ScrollShadow hideScrollBar className="w-full max-h-[100px]">
                                        {
                                            eventDates.map((date, index) => (
                                                dates && today < new Date(dates[index]) ? (
                                                    <p key={index} className="text-small text-default-600 font-medium">
                                                        <CalendarIcon className="inline mr-1" /> {date}
                                                    </p>
                                                ) : (
                                                    <p key={index} className="text-small text-default-400 font-medium line-through">
                                                        <CalendarIcon className="inline mr-1" /> {date}
                                                    </p>
                                                )
                                            ))
                                        }
                                    </ScrollShadow>
                                    )}

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
