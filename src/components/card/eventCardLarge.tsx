import { CardHeader } from "@/compat/heroui";
import { Chip } from "@/compat/heroui";
import { Avatar, Card, CardBody, Image, useDisclosure } from "@/compat/heroui";
import { useNavigate } from "react-router-dom";
import { EventDrawer } from "./eventDrawer";
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
                className="relative rounded-3xl transition-all duration-200 w-full overflow-hidden"
                isPressable
                onClick={handlePress}
                shadow="none"
            >
                <CardBody className="p-0">
                    <Image
                        removeWrapper
                        alt={props.caption ?? "Evento"}
                        className="z-0 w-full h-full object-cover rounded-3xl"
                        src={props.images?.[0]}
                    />
                </CardBody>

                {/* Bottom gradient for legibility of overlaid info */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"
                />

                {/* Owner row, floating bottom-left */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-2">
                    <Avatar
                        src={props.owner?.profilePicUrl}
                        size="sm"
                        className="ring-2 ring-white/80"
                    />
                    <span className="text-white text-sm font-semibold drop-shadow truncate">
                        {props.owner?.fullName ?? `@${props.ownerUsername}`}
                    </span>
                </div>

                {isPast && (
                    <>
                        <div
                            aria-hidden
                            className="absolute inset-0 z-30 rounded-3xl bg-default-900/70 dark:bg-default-50/70"
                        />
                        <CardHeader className="absolute top-2 left-2 z-40 p-0">
                            <Chip color="default" size="md" className="rounded-2xl">
                                Evento pasado
                            </Chip>
                        </CardHeader>
                    </>
                )}
            </Card>
            <EventDrawer isOpen={isOpen} onOpenChange={onOpenChange} cardProps={props} />
        </>
    );
};
