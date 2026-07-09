import { useMemo, useRef, useState } from "react";
import { PostData } from "@/config/apiClient";
import { useRecurringEvents } from "@/hooks/useRecurringEvents";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EventModal } from "@/components/eventModal";
import { Navbar } from "@/components/navbar";
import { ChevronLeft, ChevronRight } from "@gravity-ui/icons";
import { Skeleton } from "@heroui/react";

const DOW_LABEL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Local "YYYY-MM-DD" for a Date (matches how event dates are stored). */
const toISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

/** The organizer the session belongs to. */
const venueOf = (e: PostData) => e.owner?.fullName || e.owner?.username || "";

export const RecurringAll = () => {
    const { posts, loading } = useRecurringEvents();
    const [selected, setSelected] = useState<PostData | null>(null);
    // How many weeks ahead of today the window is shifted (0 = current week).
    const [weekOffset, setWeekOffset] = useState(0);

    // Rolling 7-day window; each column is a real date, shifted by weekOffset.
    const days = useMemo(() => {
        const base = new Date();
        base.setHours(0, 0, 0, 0);
        base.setDate(base.getDate() + weekOffset * 7);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(base);
            date.setDate(base.getDate() + i);
            return {
                iso: toISODate(date),
                label: DOW_LABEL[date.getDay()],
                dateShort: `${date.getDate()}/${date.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")}`,
                isToday: i === 0 && weekOffset === 0,
            };
        });
    }, [weekOffset]);

    // "5/jul - 11/jul" label for the visible window.
    const weekRange = `${days[0].dateShort} - ${days[6].dateShort}`;

    // The page header + day labels form one sticky block, pinned below the desktop
    // top navbar (4.75rem) or at the very top on mobile.
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const navbarOffset = isDesktop ? 72 : 0;

    // The day-label strip and the cards are separate horizontal scrollers (so the
    // labels can be viewport-sticky instead of trapped by the cards' overflow-x).
    // Keep their horizontal scroll positions in sync.
    const labelsRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const syncingRef = useRef(false);
    const syncScroll = (from: HTMLDivElement | null, to: HTMLDivElement | null) => {
        if (!from || !to || syncingRef.current) return;
        syncingRef.current = true;
        to.scrollLeft = from.scrollLeft;
        requestAnimationFrame(() => {
            syncingRef.current = false;
        });
    };


    // Place each event's sessions on the exact upcoming dates (with time) it occurs.
    const sessionsByIso = useMemo(() => {
        const map = new Map<string, { event: PostData; time: string | null }[]>();
        days.forEach((d) => map.set(d.iso, []));
        posts.forEach((event) => {
            (event.dates ?? []).forEach((d) => {
                const iso = d.slice(0, 10);
                const arr = map.get(iso);
                if (arr) {
                    const time = d.length >= 16 && d[10] === "T" ? d.slice(11, 16) : null;
                    arr.push({ event, time });
                }
            });
        });
        map.forEach((arr) =>
            arr.sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"))
        );
        return map;
    }, [posts, days]);

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-28 md:pt-24">
            {/* Desktop: opaque strip behind the floating top navbar so content
                scrolled underneath doesn't peek out between it and the header. */}
            <div
                aria-hidden
                className="fixed inset-x-0 top-0 z-40 hidden md:block"
                style={{ height: navbarOffset, backgroundColor: "var(--app-bg)" }}
            />

            <div className="flex flex-col gap-3">
                {/* Sticky block: page header + day labels pin together. */}
                <div
                    className="sticky z-30 -mx-4 flex flex-col gap-3 px-4 pt-1"
                    style={{ top: navbarOffset, backgroundColor: "var(--app-bg)" }}
                >
                    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-h2">Semanales</h1>
                            <p className="text-sm text-muted">Talleres y clases que se repiten cada semana</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            {weekOffset !== 0 && (
                                <button
                                    type="button"
                                    onClick={() => setWeekOffset(0)}
                                    className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors"
                                    style={{
                                        color: "var(--accent)",
                                        backgroundColor: "color-mix(in oklch, var(--accent) 12%, transparent)",
                                    }}
                                >
                                    Ir a la semana actual
                                </button>
                            )}
                            <div
                                className="flex items-center gap-1 rounded-full border p-1"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <button
                                    type="button"
                                    aria-label="Semana anterior"
                                    disabled={weekOffset === 0}
                                    onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                                    className="rounded-full p-1.5 transition-colors hover:bg-default-100 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <span className="min-w-[7.5rem] text-center text-sm font-semibold">{weekRange}</span>
                                <button
                                    type="button"
                                    aria-label="Semana siguiente"
                                    onClick={() => setWeekOffset((w) => w + 1)}
                                    className="rounded-full p-1.5 transition-colors hover:bg-default-100"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Day labels — synced horizontally with the cards below. */}
                    <div
                        ref={labelsRef}
                        onScroll={() => syncScroll(labelsRef.current, cardsRef.current)}
                        className="overflow-x-auto pb-1 [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden"
                    >
                        <div className="grid grid-flow-col auto-cols-[minmax(150px,1fr)] gap-3 md:grid-flow-row md:grid-cols-7">
                            {days.map((day) => (
                                <div
                                    key={day.iso}
                                    className="-mx-1.5 border-b px-1.5 pb-2"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    {day.isToday ? (
                                        <div
                                            className="rounded-xl px-3 py-2 text-center text-sm font-semibold"
                                            style={{
                                                color: "var(--accent)",
                                                backgroundColor: "color-mix(in oklch, var(--accent) 14%, transparent)",
                                            }}
                                        >
                                            {day.label} · hoy
                                        </div>
                                    ) : (
                                        <div className="rounded-xl px-3 py-2 text-center text-sm font-semibold text-muted">
                                            {day.label} <span className="font-normal">{day.dateShort}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div
                    ref={cardsRef}
                    onScroll={() => syncScroll(cardsRef.current, labelsRef.current)}
                    className="overflow-x-auto pb-2 md:overflow-visible"
                >
                    <div className="grid grid-flow-col auto-cols-[minmax(150px,1fr)] gap-3 md:grid-flow-row md:grid-cols-7">
                        {days.map((day, i) => {
                            const daySessions = sessionsByIso.get(day.iso) ?? [];
                            return (
                                <div key={day.iso} className="flex flex-col gap-3">
                                    {loading ? (
                                        Array.from({ length: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1 }).map((_, k) => (
                                            <div
                                                key={k}
                                                className="flex w-full flex-col items-start gap-1.5 rounded-2xl p-3"
                                                style={{ backgroundColor: "var(--surface-secondary)" }}
                                            >
                                                <Skeleton className="h-3 w-10 rounded" />
                                                <Skeleton className="h-4 w-4/5 rounded" />
                                                <Skeleton className="h-3 w-1/2 rounded" />
                                            </div>
                                        ))
                                    ) : daySessions.length === 0 ? (
                                        <div className="flex min-h-[92px] items-center justify-center rounded-2xl border border-dashed border-default-200 px-2 text-center text-xs text-muted">
                                            Sin actividades
                                        </div>
                                    ) : (
                                        daySessions.map(({ event, time }) => (
                                            <button
                                                key={`${day.iso}-${event._id}-${time ?? ""}`}
                                                type="button"
                                                onClick={() => setSelected(event)}
                                                className="flex w-full flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition-colors hover:brightness-110"
                                                style={{ backgroundColor: "var(--surface-secondary)" }}
                                            >
                                                {time && (
                                                    <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                                                        {time}
                                                    </span>
                                                )}
                                                <span className="text-sm font-bold leading-snug">{event.title}</span>
                                                {venueOf(event) && (
                                                    <span className="text-sm text-muted">{venueOf(event)}</span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selected && (
                <EventModal
                    event={selected}
                    isOpen={!!selected}
                    onOpenChange={(open) => !open && setSelected(null)}
                />
            )}

            <Navbar />
        </div>
    );
};
