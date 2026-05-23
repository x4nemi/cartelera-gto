import { Chip } from "@heroui/react";
import { Avatar, Card, Image, useDisclosure } from "@/compat/heroui";
import { useNavigate } from "react-router-dom";
import { EventDrawer } from "./eventDrawer";
import { PostData } from "@/config/apiClient";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
// const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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

    // const eventDate = (() => {
    //     if (!props.dates?.length) return new Date();
    //     const future = props.dates
    //         .map(parseLocalDate)
    //         .filter((d) => d >= today)
    //         .sort((a, b) => a.getTime() - b.getTime());
    //     if (future.length) return future[0];
    //     const past = props.dates
    //         .map(parseLocalDate)
    //         .filter((d) => d < today)
    //         .sort((a, b) => b.getTime() - a.getTime());
    //     return past[0] ?? new Date();
    // })();
    // const month = months[eventDate.getMonth()];
    // const day = eventDate.getDate();
    // const weekday = weekdays[eventDate.getDay()];

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

    const { title, summary, location, price, tags, caption, owner, ownerUsername, images } = props;

    // Headline fallback: AI title → first non-empty caption line → "Evento"
    const headline =
        title?.trim() ||
        caption?.split("\n").map((s) => s.trim()).find(Boolean) ||
        "Evento";

    return (
        <>
            <Card
                className="relative w-full overflow-hidden rounded-3xl transition-all duration-200 group"
                isPressable
                onClick={handlePress}
                shadow="none"
            >
                {/* Poster — fills the entire card. Portrait orientation across breakpoints so the artwork stays the protagonist. */}
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-content2">
                    <Image
                        removeWrapper
                        alt={headline}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        classNames={{ img: "rounded-none" }}
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

                    {/* Top-right: date badge */}
                    {/* Top-right: date badge — colored header strip + bold day */}
                    {/* <div className="absolute top-3 right-3 z-20 flex flex-col items-center overflow-hidden rounded-[18px] bg-white/95 dark:bg-content1/95 backdrop-blur-md shadow-lg ring-1 ring-black/5 w-12">
                        <div className="w-full bg-primary text-primary-foreground text-[10px] font-bold tracking-[0.12em] text-center py-0.5">
                            {month}
                        </div>
                        <div className="flex flex-col items-center w-full px-1 pt-0.5 pb-1">
                            <span className="font-bold leading-none font-mono text-large text-foreground">
                                {day}
                            </span>
                            <span className="text-[10px] leading-tight text-default-500 mt-0.5">
                                {weekday}
                            </span>
                        </div>
                    </div> */}

                    {/* Bottom gradient + metadata overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-4 px-4 sm:px-5">
                        <div className="flex flex-col gap-2 text-left">
                            <h3 className="text-large sm:text-xl md:text-2xl font-semibold leading-tight line-clamp-2 tracking-tight text-white">
                                {headline}
                            </h3>

                            {summary && (
                                <p className="text-small text-white/80 leading-snug line-clamp-2 hidden sm:block">
                                    {summary}
                                </p>
                            )}

                            {(location || price || (tags && tags.length > 0)) && (
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
