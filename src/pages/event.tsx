import { CosmosAPI, PostData } from "@/config/apiClient";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Link, Spinner, User } from "@heroui/react";
import { ImageCarousel } from "@/components/image/imageCarousel";
import { CalendarIcon } from "@/components/icons";
import { EventTypeChip } from "@/components/card/eventTypeChip";
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

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
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

    const { dates, images, ownerUsername, caption, ownerFullName, ownerProfilePicUrl } = event;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDates = (dates ?? [])
        .map((date, i) => {
            const [y, m, d] = date.split("-").map(Number);
            const dateObj = new Date(y, m - 1, d);
            return {
                index: i,
                raw: date,
                dateObj,
                label: dateObj.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short", year: "numeric" }),
                isPast: today > dateObj,
            };
        })
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto bg-content1 mt-5 rounded-3xl">
                {/* Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between pt-3 px-5">
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
                    <EventTypeChip type={event.type} variant="drawer" />
                    <Button
                        className="font-medium text-small text-default-500"
                        endContent={
                            <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
                                <path d="M7 17 17 7M7 7h10v10" />
                            </svg>
                        }
                        size="sm"
                        variant="flat"
                        as={Link}
                        href={event.url}
                        target="_blank"
                    >
                        Página del evento
                    </Button>
                </div>

                {/* Images */}
                <div className="flex w-full justify-center">
                    <ImageCarousel images={[...(images ?? [])].flat()} />
                </div>

                {/* Dates */}
                {eventDates.length > 0 && (
                    <div className="flex flex-col px-5">
                        {eventDates.map((d, i) => {
                            const prevIsPast = i > 0 && eventDates[i - 1].isPast;
                            const isNext = !d.isPast && (i === 0 || prevIsPast);
                            return d.isPast ? (
                                <p key={i} className="text-small text-default-400 font-medium line-through">
                                    <CalendarIcon className="inline mr-1" /> {d.label}
                                </p>
                            ) : (
                                <p key={i} className={`text-small text-default-600 ${isNext ? "text-primary" : ""}`}>
                                    <CalendarIcon className="inline mr-1" /> {d.label}
                                </p>
                            );
                        })}
                    </div>
                )}

                {/* Caption */}
                <div className="flex flex-col gap-3 px-5">
                    <span className="text-medium font-medium">Acerca de este evento</span>
                    <p className="text-medium text-default-500 whitespace-pre-line">{caption}</p>
                </div>

                {/* Owner */}
                <div className="border-t border-default-200/50 py-4 justify-center items-center flex bg-content2 rounded-b-3xl">
                    <Link
                        href={`https://instagram.com/${ownerUsername}`}
                        target="_blank"
                        className="text-foreground"
                    >
                        <User
                            name={ownerFullName}
                            description={"@" + ownerUsername}
                            avatarProps={{ src: ownerProfilePicUrl }}
                        />
                    </Link>
                </div>
            </div>
        </DefaultLayout>
    );
};
