import { Card, CardBody, CardHeader, Chip, Image, useDisclosure } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { EventDrawer } from "./eventDrawer";
import { EventTypeChip } from "./eventTypeChip";
import { PostData } from "@/config/apiClient";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
};

/**
 * Larger, single-column-friendly variant of EventCard used by the calendar
 * view. Date is omitted from the card itself because the surrounding section
 * header already states the day.
 */
export const EventCardLarge = (props: PostData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = props.dates ? props.dates.every((d) => parseLocalDate(d) < today) : false;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const isMobile = useMediaQuery("(max-width: 640px)");
    const navigate = useNavigate();

    const handlePress = () => {
        if (isMobile) {
            navigate(`/evento/${props.shortCode}`);
        } else {
            onOpen();
        }
    };

    return (
        <>
            <Card
                className="rounded-3xl transition-all duration-200 w-full"
                isPressable
                onClick={handlePress}
                shadow="none"
            >
                {!isPast ? (
                    <CardHeader className="absolute top-2 left-2 z-10 p-0">
                        <EventTypeChip type={props.type} />
                    </CardHeader>
                ) : (
                    <>
                        <CardHeader className="absolute top-2 right-2 z-10 p-0">
                            <Chip color="default" size="md" className="rounded-2xl">
                                Evento pasado
                            </Chip>
                        </CardHeader>
                        <CardHeader className="absolute inset-0 z-9 p-0 rounded-3xl bg-default-900/70 dark:bg-default-50/70" />
                    </>
                )}

                <CardBody className="overflow-visible p-0">
                    <Image
                        removeWrapper
                        alt={props.caption ?? "Evento"}
                        className="z-0 w-full h-full object-cover rounded-3xl"
                        src={props.displayUrl}
                    />
                </CardBody>
            </Card>
            <EventDrawer isOpen={isOpen} onOpenChange={onOpenChange} cardProps={props} />
        </>
    );
};
