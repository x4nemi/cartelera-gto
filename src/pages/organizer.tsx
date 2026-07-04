import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Label, Spinner, Surface } from "@heroui/react";
import { ArrowLeft, MapPin } from "@gravity-ui/icons";
import { InstagramLogoIcon, FacebookLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";

import type { PostData } from "@/types";
import { EventCard } from "@/components/eventCard";
import { Navbar } from "@/components/navbar";
import { useProfile, useOrganizerEvents } from "@/hooks/useOrganizer";
import { isOngoing } from "@/utils/recurrence";
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

export const Organizer = () => {
    const { username = "" } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useProfile(username);
    const { posts, loading: loadingEvents } = useOrganizerEvents(username);
    const [tab, setTab] = useState<"proximos" | "semana">("proximos");

    const upcoming = useMemo(
        () => posts.filter((p) => !isOngoing(p.dates, p.endsOn)).sort(byDate),
        [posts],
    );
    const weekly = useMemo(
        () => posts.filter((p) => isOngoing(p.dates, p.endsOn)).sort(byDate),
        [posts],
    );
    const list = tab === "proximos" ? upcoming : weekly;

    const locations = useMemo(() => parseLocations(user?.biography), [user]);
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
        <div className="mx-auto min-h-dvh max-w-xl px-4 pb-28">
            {/* Top bar */}
            <div className="flex items-center py-3">
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
            <div className="flex flex-row items-center gap-3 text-center">
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
                        <b>{upcoming.length + weekly.length}</b> <span className="text-muted"> eventos activos</span>
                    </span>
                </div>
            </div>
            <Surface variant="secondary" className="mt-4 rounded-2xl p-4">
                <Label className="mb-2 text-sm font-semibold">Biografía</Label>
                {user.biography && (
                    <p className="max-w-md whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                        {user.biography}
                    </p>
                )}
            </Surface>

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
                                href={mapsUrl(loc)}
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

            {/* Tabs */}
            <div className="mt-6 flex rounded-full bg-default-100 p-1 text-sm font-semibold">
                {(["proximos", "semana"] as const).map((key) => {
                    const active = tab === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setTab(key)}
                            className="flex-1 rounded-full px-4 py-2 transition-colors"
                            style={
                                active
                                    ? { backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }
                                    : undefined
                            }
                        >
                            {key === "proximos" ? "Próximos" : "Cada semana"}
                        </button>
                    );
                })}
            </div>

            {/* Event list */}
            <div className="mt-4 flex flex-col gap-4">
                {loadingEvents ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : list.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted">
                        {tab === "proximos"
                            ? "No hay eventos próximos."
                            : "No hay eventos recurrentes."}
                    </p>
                ) : (
                    list.map((event) => (
                        <EventCard
                            key={event._id ?? event.shortCode}
                            event={event}
                            time={primaryTime(event)}
                        />
                    ))
                )}
            </div>

            <Navbar />
        </div>
    );
};
