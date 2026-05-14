import { CosmosAPI, PostData } from "@/config/apiClient";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Chip, Divider, Link, ScrollShadow, Spinner, User } from "@heroui/react";
import { ImageCarousel } from "@/components/image/imageCarousel";
import { CalendarIcon, MapPinIcon, MoneyIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export const EventPage = () => {
    const { shortCode } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shortCode) return;
        CosmosAPI.getEvent(shortCode)
            .then(setEvent)
            .catch(() => setEvent(null))
            .finally(() => setLoading(false));
    }, [shortCode]);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const parsedDates = useMemo(() => {
        if (!event?.dates) return [];
        return event.dates
            .map((raw) => {
                const [y, m, d] = raw.split("-").map(Number);
                const dateObj = new Date(y, m - 1, d);
                return {
                    raw,
                    dateObj,
                    label: dateObj.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                    short: dateObj.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }),
                    isPast: dateObj < today,
                };
            })
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    }, [event?.dates, today]);

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center w-full flex-grow">
                    <Spinner size="lg" color="primary" />
                </div>
            </DefaultLayout>
        );
    }

    if (!event) {
        return (
            <DefaultLayout>
                <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
                    <p className="text-foreground-500">Evento no encontrado</p>
                    <Button variant="flat" color="primary" className="rounded-2xl" onPress={() => navigate("/")}>
                        Volver al inicio
                    </Button>
                </div>
            </DefaultLayout>
        );
    }

    const { images, ownerUsername, owner, title, summary, location, price, tags, url } = event;

    const nextDate = parsedDates.find((d) => !d.isPast) ?? parsedDates[parsedDates.length - 1];
    const hasMultipleDates = parsedDates.length > 1;

    return (
        <DefaultLayout>
            <div className="flex flex-col w-full max-w-2xl bg-content1 mt-5 rounded-3xl mx-auto overflow-hidden border border-default-200/60">
                {/* Header */}
                <div className="flex items-center justify-between pt-3 px-3 pb-1">
                    <Button
                        isIconOnly
                        variant="light"
                        className="text-default-500"
                        onPress={() => navigate(-1)}
                    >
                        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Button>
                    {url && (
                        <Button
                            className="font-medium text-small text-default-600"
                            endContent={
                                <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                                    <path d="M7 17 17 7M7 7h10v10" />
                                </svg>
                            }
                            size="sm"
                            variant="flat"
                            as={Link}
                            href={url}
                            target="_blank"
                        >
                            Página del evento
                        </Button>
                    )}
                </div>

                {/* Image */}
                {images && images.length > 0 && (
                    <div className="flex w-full justify-center px-3 pt-2">
                        <div className="w-full rounded-2xl overflow-hidden bg-content2">
                            <ImageCarousel images={[...(images ?? [])].flat()} />
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-5 px-5 sm:px-6 py-5">
                    {/* Title + summary */}
                    {(title || summary) && (
                        <div className="flex flex-col gap-1.5">
                            {title && (
                                <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                                    {title}
                                </h1>
                            )}
                            {summary && (
                                <p className="text-medium text-default-500 leading-snug">{summary}</p>
                            )}
                        </div>
                    )}

                    {/* Quick facts */}
                    {(nextDate || location || price) && (
                        <div className="flex flex-col gap-2 rounded-2xl bg-content2/60 border border-default-200/60 p-3">
                            {nextDate && (
                                <div className="flex items-start gap-2">
                                    <CalendarIcon className="text-primary shrink-0 mt-0.5" size={18} />
                                    <div className="flex flex-col">
                                        <span className="text-small font-medium text-foreground capitalize">
                                            {nextDate.short}
                                        </span>
                                        {hasMultipleDates && (
                                            <span className="text-tiny text-default-500">
                                                {parsedDates.length} fechas en total
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-start gap-2">
                                    <MapPinIcon size={18} className="text-default-500 shrink-0 mt-0.5" />
                                    <span className="text-small text-foreground">{location}</span>
                                </div>
                            )}
                            {price && (
                                <div className="flex items-start gap-2">
                                    <MoneyIcon size={18} className="text-default-500 shrink-0 mt-0.5" />
                                    <span className="text-small text-foreground">{price}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((t) => (
                                <Chip key={t} variant="flat" color="primary" size="sm" className="rounded-xl">
                                    #{t}
                                </Chip>
                            ))}
                        </div>
                    )}

                    {/* All dates list */}
                    {hasMultipleDates && (
                        <>
                            <Divider />
                            <div className="flex flex-col gap-2">
                                <span className="text-small font-medium text-default-700">
                                    Todas las fechas
                                </span>
                                <ScrollShadow hideScrollBar className="w-full max-h-[180px] flex flex-col gap-1">
                                    {parsedDates.map((d) => {
                                        const isNext = d === nextDate;
                                        return (
                                            <p
                                                key={d.raw}
                                                className={`text-small capitalize ${
                                                    d.isPast
                                                        ? "text-default-400 line-through"
                                                        : isNext
                                                            ? "text-primary font-medium"
                                                            : "text-default-600"
                                                }`}
                                            >
                                                <CalendarIcon className="inline mr-1.5" /> {d.label}
                                            </p>
                                        );
                                    })}
                                </ScrollShadow>
                            </div>
                        </>
                    )}
                </div>

                {/* Owner */}
                <div className="border-t border-default-200/50 py-4 justify-center items-center flex bg-content2/60">
                    <Link
                        href={`https://instagram.com/${ownerUsername}`}
                        target="_blank"
                        className="text-foreground"
                    >
                        <User
                            name={owner?.fullName}
                            description={"@" + ownerUsername}
                            avatarProps={{ src: owner?.profilePicUrl }}
                        />
                    </Link>
                </div>
            </div>
        </DefaultLayout>
    );
};
