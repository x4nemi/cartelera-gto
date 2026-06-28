import { Chip } from "@/compat/heroui";
import { Avatar, Card, Image, useDisclosure } from "@/compat/heroui";
import { useNavigate } from "react-router-dom";
import { EventDrawer } from "./eventDrawer";
import { PostData } from "@/config/apiClient";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const parseLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
};

/**
 * Poster-first event card for the calendar feed. The image is the protagonist:
 * it fills the entire card and metadata sits on a translucent overlay panel
 * along the bottom, with the date badge and owner chip floating on top.
 */
export const EventRowCard = (props: PostData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = (() => {
        if (!props.dates?.length) return new Date();
        const future = props.dates
            .map(parseLocalDate)
            .filter((d) => d >= today)
            .sort((a, b) => a.getTime() - b.getTime());
        if (future.length) return future[0];
        const past = props.dates
            .map(parseLocalDate)
            .filter((d) => d < today)
            .sort((a, b) => b.getTime() - a.getTime());
        return past[0] ?? new Date();
    })();
    const month = months[eventDate.getMonth()];
    const day = eventDate.getDate();
    const weekday = weekdays[eventDate.getDay()];

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

    const { title, tags, caption, owner, ownerUsername, images } = props;

    // Headline fallback: AI title → first non-empty caption line → "Evento"
    const headline =
        title?.trim() ||
        caption?.split("\n").map((s) => s.trim()).find(Boolean) ||
        "Evento";

    return (
        <>
            <Card
                className="relative w-full rounded-3xl transition-all duration-200 group"
                isPressable
                onClick={handlePress}
                shadow="none"
            >
                <div className="relative w-full overflow-hidden rounded-3xl bg-content2">
                    <Image
                        removeWrapper
                        alt={headline}
                        className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                        classNames={{ img: "block h-auto w-full rounded-none" }}
                        src={images?.[0]}
                    />

                    {/* Top-left: owner chip floating on the poster */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-[18px] bg-black/45 backdrop-blur-md px-2 py-2 max-w-[60%]">
                        <Avatar
                            src={owner?.profilePicUrl}
                            size="sm"
                            className="w-5 h-5 shrink-0"
                        />
                        <span className="text-tiny text-white truncate">
                            {owner?.fullName ?? `@${ownerUsername}`}
                        </span>
                    </div>

                    {/* Bottom gradient + metadata overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent pt-3 pb-4 px-4 sm:px-5">
                        <div className="flex flex-row justify-between gap-2 text-left">
                            <h3 className="text-large sm:text-xl md:text-2xl font-semibold leading-tight line-clamp-2 tracking-tight text-white">
                                {weekday}, {day} de {month}
                            </h3>

                            { (tags && tags.length > 0) && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    {tags?.slice(0, 2).map((t) => (
                                        <Chip
                                            key={t}
                                            size="sm"
                                            variant="soft"
                                            className="rounded-[10px] bg-primary/80 text-white backdrop-blur-md"
                                        >
                                            #{t}
                                        </Chip>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isPast && (
                    <>
                        <div
                            aria-hidden
                            className="absolute inset-0 z-30 rounded-3xl bg-default-900/70 dark:bg-default-50/70 pointer-events-none"
                        />
                        <div className="absolute top-3 right-3 z-40">
                            <Chip color="default" size="sm" className="rounded-xl">
                                Evento pasado
                            </Chip>
                        </div>
                    </>
                )}
            </Card>
            <EventDrawer isOpen={isOpen} onOpenChange={onOpenChange} cardProps={props} />
        </>
    );
};
