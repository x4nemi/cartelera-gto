import { PostData } from "@/config/apiClient";
import { Modal, Button, Avatar, ToggleButton, Surface } from "@heroui/react";
import { ArrowsRotateLeft, Calendar, MapPin, Ticket, ArrowLeft, Heart, HeartFill } from "@gravity-ui/icons";
import { getOngoingLabel, getRecurrenceDays, getRecurrenceEndLabel, formatRecurrenceLong, parseLocalDate } from "@/utils/recurrence";
import { toggleLike, useIsLiked } from "@/hooks/useLikedEvents";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InstagramLogoIcon } from "@phosphor-icons/react";

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const isoToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Format one date entry ("YYYY-MM-DD[THH:mm]") as "Lun 6 de julio · 19:00". */
const formatDateEntry = (s: string) => {
    const d = parseLocalDate(s);
    if (Number.isNaN(d.getTime())) return s;
    const wd = capitalize(d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", ""));
    const month = d.toLocaleDateString("es-MX", { month: "long" });
    const time = s.length >= 16 && s[10] === "T" ? s.slice(11, 16) : null;
    return `${wd} ${d.getDate()} de ${month}${time ? ` · ${time}` : ""}`;
};

/** First upcoming date (with optional time) for an event. */
const getPrimaryDate = (event: PostData) => {
    const dates = [...(event.dates ?? [])].sort();
    if (dates.length === 0) return null;
    const today = isoToday();
    const pick = dates.find((d) => d.slice(0, 10) >= today) ?? dates[0];
    const date = parseLocalDate(pick);
    if (Number.isNaN(date.getTime())) return null;
    const time = pick.length >= 16 && pick[10] === "T" ? pick.slice(11, 16) : null;
    return { date, time };
};

/** Google Calendar "add event" template URL. */
const googleCalendarUrl = (event: PostData, date: Date, time: string | null) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const day = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const stamp = (d: Date) => `${day(d)}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    let dates: string;
    if (time) {
        const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);
        dates = `${stamp(date)}/${stamp(end)}`;
    } else {
        const end = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        dates = `${day(date)}/${day(end)}`;
    }
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: event.title || "Evento",
        dates,
        details: event.caption || "",
        location: event.location || "",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

interface EventModalProps {
    event: PostData;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EventModal = ({ event, isOpen, onOpenChange }: EventModalProps) => {
    const { title, images, tags, location, price, owner, url, caption } = event;
    const isLiked = useIsLiked(event);
    const isMobile = useMediaQuery("(max-width: 640px)");
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [datesOpen, setDatesOpen] = useState(false);
    const captionLong = !!caption && (caption.length > 180 || caption.split("\n").length > 4);

    const ongoing = getOngoingLabel(event.dates, event.endsOn);
    const primary = getPrimaryDate(event);
    const allDates = [...(event.dates ?? [])].sort();
    const hasMultipleDates = allDates.length > 1;
    let dateText: string | null = null;
    let DateIcon = Calendar;
    if (ongoing) {
        dateText = ongoing.text;
        DateIcon = ongoing.kind !== "until" ? ArrowsRotateLeft : Calendar;
        if (ongoing.kind === "weekly") {
            const recurrenceDays = getRecurrenceDays(event.dates);
            if (recurrenceDays) dateText = formatRecurrenceLong(recurrenceDays);
            const endLabel = getRecurrenceEndLabel(event.dates, event.endsOn);
            if (endLabel) dateText += ` · hasta el ${endLabel}`;
        }
    } else if (primary) {
        const d = primary.date;
        const month = d.toLocaleDateString("es-MX", { month: "long" });
        dateText =
            `${capitalize(WEEKDAYS[d.getDay()])} ${d.getDate()} de ${month}` +
            (primary.time ? ` · ${primary.time}` : "");
    }

    const gcalHref = primary ? googleCalendarUrl(event, primary.date, primary.time) : null;
    const mapsHref = location
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
        : null;

    return (
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
            <Modal.Container size={ "lg"} placement="auto">
                <Modal.Dialog className={isMobile ? "border-2 border-default-200 rounded-3xl m-0 p-0" : " m-0 p-0"}>
                    <Modal.Body className="flex flex-col p-0">
                        {/* Sticky back button: stays pinned while the modal scrolls. */}
                        <div className="pointer-events-none sticky top-0 z-20 h-0">
                            <button
                                type="button"
                                aria-label="Regresar"
                                onClick={() => onOpenChange(false)}
                                className="pointer-events-auto absolute left-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                        </div>
                        <div className="relative">
                            <img
                                alt={title}
                                className={`h-auto w-full ${isMobile ? "" : "rounded-t-2xl"}`}
                                src={images[0]}
                            />
                        </div>

                        <div className="flex flex-col gap-5 px-4 pb-2 pt-5">
                            <div className="flex flex-col gap-1.5">
                                <h2 className="text-h3">{title}</h2>
                                {tags && tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 text-sm text-muted">
                                        {tags.map((tag) => (
                                            <span key={tag}>#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Details card */}
                            {(dateText || price || location) && (
                                <Surface
                                    variant="secondary"
                                    className="divide-y divide-default-200 overflow-hidden rounded-2xl"
                                >
                                    {dateText && (
                                        <div className="flex flex-col gap-2 px-4 py-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-2.5 text-sm font-medium">
                                                    <DateIcon className="size-4 shrink-0" style={{ color: "var(--accent)" }} />
                                                    {dateText}
                                                </span>
                                                {gcalHref && (
                                                    <a
                                                        href={gcalHref}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="shrink-0 text-sm font-semibold"
                                                        style={{ color: "var(--accent)" }}
                                                    >
                                                        + Calendario
                                                    </a>
                                                )}
                                            </div>
                                            {hasMultipleDates && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDatesOpen((v) => !v)}
                                                        className="w-fit pl-[26px] text-xs font-semibold"
                                                        style={{ color: "var(--accent)" }}
                                                    >
                                                        {datesOpen
                                                            ? "Ver menos"
                                                            : `Ver ${allDates.length} fechas`}
                                                    </button>
                                                    {datesOpen && (
                                                        <ul className="flex flex-col gap-1.5 pl-[26px] pt-1 text-sm text-foreground/85">
                                                            {allDates.map((s) => (
                                                                <li key={s} className="flex items-center gap-2">
                                                                    <span
                                                                        className="size-1.5 shrink-0 rounded-full"
                                                                        style={{ backgroundColor: "var(--accent)" }}
                                                                    />
                                                                    {formatDateEntry(s)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    {price && (
                                        <div className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium">
                                            <Ticket className="size-4 shrink-0" style={{ color: "var(--accent)" }} />
                                            {price}
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center justify-between gap-3 px-4 py-3">
                                            <span className="flex items-center gap-2.5 text-sm font-medium">
                                                <MapPin className="size-4 shrink-0" style={{ color: "var(--accent)" }} />
                                                {location}
                                            </span>
                                            {mapsHref && (
                                                <a
                                                    href={mapsHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 text-sm font-semibold"
                                                    style={{ color: "var(--accent)" }}
                                                >
                                                    Cómo llegar
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </Surface>
                            )}

                            {/* Description */}
                            {caption && (
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-sm font-semibold text-muted">De qué va</h3>
                                    <p
                                        className={`text-sm leading-relaxed text-foreground/85 ${expanded || !captionLong ? "whitespace-pre-line" : "line-clamp-4 whitespace-pre-line"}`}
                                    >
                                        {caption}
                                    </p>
                                    {captionLong && (
                                        <button
                                            type="button"
                                            onClick={() => setExpanded((v) => !v)}
                                            className="w-fit text-sm font-semibold"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            {expanded ? "menos" : "más"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Organizer */}
                            <Surface
                                variant="secondary"
                                role={owner?.username ? "button" : undefined}
                                tabIndex={owner?.username ? 0 : undefined}
                                onClick={() => {
                                    if (!owner?.username) return;
                                    onOpenChange(false);
                                    navigate(`/eventos/${owner.username}`);
                                }}
                                onKeyDown={(e) => {
                                    if (!owner?.username) return;
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onOpenChange(false);
                                        navigate(`/eventos/${owner.username}`);
                                    }
                                }}
                                className={`flex items-center gap-3 rounded-2xl p-3${owner?.username ? " cursor-pointer" : ""}`}
                            >
                                <Avatar className="size-11">
                                    <Avatar.Image
                                        alt={owner?.fullName || owner?.username || "User"}
                                        src={owner?.profilePicUrl}
                                    />
                                    <Avatar.Fallback>XL</Avatar.Fallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">
                                        {owner?.fullName || owner?.username}
                                    </span>
                                    <span className="text-xs text-muted">@{owner?.username}</span>
                                </div>
                            </Surface>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex items-center gap-2 pb-4 px-4">
                        {url && (
                            <Button
                                className="flex-1"
                                onPress={() => window.open(url, "_blank", "noopener,noreferrer")}
                            >
                                <InstagramLogoIcon weight="bold" />
                                Ver publicación original
                            </Button>
                        )}
                        <ToggleButton
                            isIconOnly
                            aria-label="Me gusta"
                            isSelected={isLiked}
                            onChange={() => toggleLike(event)}
                        >
                            {({ isSelected: selected }) =>
                                selected ? <HeartFill /> : <Heart />
                            }
                        </ToggleButton>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
};
