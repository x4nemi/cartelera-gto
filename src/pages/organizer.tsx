import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Label, Spinner, Surface } from "@heroui/react";
import { ArrowLeft, MapPin } from "@gravity-ui/icons";
import { InstagramLogoIcon, FacebookLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";

import type { PostData } from "@/types";
import { EventCard } from "@/components/eventCard";
import { EventCardSkeleton } from "@/components/eventCardSkeleton";
import { Navbar } from "@/components/navbar";
import { useProfile, useOrganizerEvents } from "@/hooks/useOrganizer";
import { parseLocalDate } from "@/utils/recurrence";
import {
    parseLocations,
    instagramUrl,
    facebookUrl,
    whatsappUrl,
    mapsUrl,
} from "@/utils/organizer";

const isoToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** First upcoming date string ("YYYY-MM-DD[THH:mm]") for sorting/time display. */
const primaryDateStr = (event: PostData): string | null => {
    const dates = [...(event.dates ?? [])].sort();
    if (dates.length === 0) return null;
    const today = isoToday();
    return dates.find((d) => d.slice(0, 10) >= today) ?? dates[0];
};

/** "HH:mm" if the primary date carries a time, else null. */
const primaryTime = (event: PostData): string | null => {
    const s = primaryDateStr(event);
    return s && s.length >= 16 && s[10] === "T" ? s.slice(11, 16) : null;
};

const byDate = (a: PostData, b: PostData) =>
    (primaryDateStr(a) ?? "").localeCompare(primaryDateStr(b) ?? "");

/** Compact date label for a card, e.g. "Sáb 11 jul" (next date when recurring). */
const shortDateLabel = (event: PostData): string | null => {
    const s = primaryDateStr(event);
    if (!s) return null;
    const d = parseLocalDate(s.slice(0, 10));
    if (Number.isNaN(d.getTime())) return null;
    const wd = d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "");
    const mo = d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "");
    return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${d.getDate()} ${mo}`;
};

export const Organizer = () => {
    const { username = "" } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useProfile(username);
    const { posts, loading: loadingEvents } = useOrganizerEvents(username);

    // One combined list (one-off + recurring), sorted by their next date.
    const list = useMemo(() => [...posts].sort(byDate), [posts]);

    const locations = useMemo(() => {
        // Prefer the clean, AI-extracted address stored on the organizer.
        if (user?.address) return [user.address];
        const fromBio = parseLocations(user?.biography);
        if (fromBio.length) return fromBio;
        // No address in the bio: fall back to the organizer's most frequent event venue.
        const counts = new Map<string, number>();
        for (const p of posts) {
            const loc = p.location?.trim();
            if (loc) counts.set(loc, (counts.get(loc) || 0) + 1);
        }
        const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        return best ? [best] : [];
    }, [user, posts]);
    const ig = user ? instagramUrl(user) : null;
    const wa = user ? whatsappUrl(user) : null;
    const fb = user ? facebookUrl(user) : null;

    if (loading) {
        return (
            <div className="flex min-h-dvh items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-lg font-semibold">Organizador no encontrado</p>
                <p className="text-sm text-muted">No encontramos a @{username}.</p>
                <Button onPress={() => navigate("/")}>Ir al inicio</Button>
                <Navbar />
            </div>
        );
    }

    const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

    return (
        <div className="mx-auto min-h-dvh max-w-xl px-4 pb-28 md:pt-20">
            {/* Top bar (mobile only) */}
            <div className="flex items-center py-3 md:hidden">
                <button
                    type="button"
                    aria-label="Regresar"
                    onClick={() => navigate(-1)}
                    className="flex size-9 items-center justify-center rounded-full bg-default-100 transition-colors hover:bg-default-200"
                >
                    <ArrowLeft className="size-5" />
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-row items-center gap-3 text-center md:mt-8">
                <Avatar className="size-24">
                    <Avatar.Image alt={user.fullName || user.username} src={user.profilePicUrl} />
                    <Avatar.Fallback>
                        {(user.fullName || user.username).slice(0, 2).toUpperCase()}
                    </Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 text-start">
                    <h1 className="text-h3">{user.fullName || user.username}</h1>
                    <span className="text-sm text-muted">@{user.username}</span>
                    <span>
                        <b>{list.length}</b> <span className="text-muted"> eventos activos</span>
                    </span>
                </div>
            </div>
            {user.biography && (
                <Surface variant="secondary" className="mt-4 rounded-2xl p-4">
                    <Label className="mb-2 text-sm font-semibold">Biografía</Label>
                    <p className="max-w-md whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                        {user.biography}
                    </p>
                </Surface>
            )}

            {/* Social buttons */}
            <div className="mt-4 flex items-center gap-2">
                {wa ? (
                    <Button className="flex-1" onPress={() => open(wa)}>
                        <WhatsappLogoIcon weight="bold" />
                        WhatsApp
                    </Button>
                ) : ig ? (
                    <Button className="flex-1" onPress={() => open(ig)}>
                        <InstagramLogoIcon weight="bold" />
                        Instagram
                    </Button>
                ) : null}
                {wa && ig && (
                    <Button isIconOnly aria-label="Instagram" onPress={() => open(ig)}>
                        <InstagramLogoIcon weight="bold" />
                    </Button>
                )}
                {fb && (
                    <Button isIconOnly aria-label="Facebook" onPress={() => open(fb)}>
                        <FacebookLogoIcon weight="bold" />
                    </Button>
                )}
            </div>

            {/* Locations */}
            {locations.length > 0 && (
                <Surface
                    variant="secondary"
                    className="mt-4 divide-y divide-default-200 overflow-hidden rounded-2xl"
                >
                    {locations.map((loc) => (
                        <div key={loc} className="flex items-center justify-between gap-3 px-4 py-3">
                            <span className="flex items-center gap-2.5 text-sm font-medium">
                                <MapPin className="size-4 shrink-0" style={{ color: "var(--accent)" }} />
                                {loc}
                            </span>
                            <a
                                href={
                                    user?.geo && loc === user?.address
                                        ? `https://www.google.com/maps/search/?api=1&query=${user.geo.lat},${user.geo.lng}`
                                        : mapsUrl(loc)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 text-sm font-semibold"
                                style={{ color: "var(--accent)" }}
                            >
                                Cómo llegar
                            </a>
                        </div>
                    ))}
                </Surface>
            )}

            {/* Section header with the nearest event's date */}
            <div className="mt-6 flex items-baseline justify-between gap-2">
                <h2 className="text-h3">Eventos</h2>
            </div>

            {/* Event list */}
            <div className="mt-4 flex flex-col gap-4">
                {loadingEvents ? (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                ) : list.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted">
                        No hay eventos.
                    </p>
                ) : (
                    list.map((event) => (
                        <EventCard
                            key={event._id ?? event.shortCode}
                            event={event}
                            time={primaryTime(event)}
                            dateLabel={shortDateLabel(event)}
                        />
                    ))
                )}
            </div>

            <Navbar />
        </div>
    );
};
