import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { parseLocalDate } from "@/utils/recurrence";
import { PostData } from "@/types";
import { EventCard } from "./eventCard";
import { WeekStrip } from "./weekStrip";
import { MonthCalendar } from "./monthCalendar";

const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Keep showing an event until this long after its start time. */
const GRACE_MS = 2 * 60 * 60 * 1000;

/** Pick the display date/time for a post: the earliest still-relevant date.
 *  A timed event stays visible until 2h after its start time; a date-only
 *  event stays visible through the whole day. Returns null once every date has
 *  passed that window. */
const getDisplay = (post: PostData) => {
    const dates = [...(post.dates ?? [])].sort();
    if (dates.length === 0) return null;
    const now = new Date();
    const todayIso = toIso(now);

    const isShowable = (d: string) => {
        const dayIso = d.slice(0, 10);
        if (dayIso > todayIso) return true; // future day
        if (dayIso < todayIso) return false; // past day
        // today: date-only shows all day; timed shows until start + 2h
        const hasTime = d.length >= 16 && d[10] === "T";
        if (!hasTime) return true;
        return now.getTime() < parseLocalDate(d).getTime() + GRACE_MS;
    };

    const pick = dates.find(isShowable);
    if (!pick) return null;
    const date = parseLocalDate(pick);
    if (Number.isNaN(date.getTime())) return null;
    const time = pick.length >= 16 && pick[10] === "T" ? pick.slice(11, 16) : null;
    return { iso: pick.slice(0, 10), date, time };
};

export const EventList = ({ variant = "home" }: { variant?: "home" | "full" }) => {
    const { posts, loading, loadingMore, hasMore, loadMore } = useEvents();
    const navigate = useNavigate();
    const todayIso = toIso(new Date());
    const [selectedIso, setSelectedIso] = useState(todayIso);
    const [activeWeek, setActiveWeek] = useState(0);
    const [highlightIso, setHighlightIso] = useState<string | null>(null);
    const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showStrip = variant === "full";

    // Group posts by day.
    const groupsMap = new Map<
        string,
        { date: Date; items: { post: PostData; time: string | null }[] }
    >();
    posts.forEach((post) => {
        const disp = getDisplay(post);
        if (!disp) return;
        if (!groupsMap.has(disp.iso)) groupsMap.set(disp.iso, { date: disp.date, items: [] });
        groupsMap.get(disp.iso)!.items.push({ post, time: disp.time });
    });
    const groups = [...groupsMap.entries()]
        .map(([iso, g]) => ({ iso, ...g }))
        .sort((a, b) => (a.iso < b.iso ? -1 : 1));
    groups.forEach((g) =>
        g.items.sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"))
    );

    // One entry per week (7 days each), from this week up to the last event's week.
    const lastGroupIso = groups.length ? groups[groups.length - 1].iso : "";
    const weeks = useMemo(() => {
        const base = new Date();
        base.setHours(0, 0, 0, 0);
        const last = lastGroupIso ? parseLocalDate(lastGroupIso) : base;
        const spanDays = Math.max(0, Math.round((last.getTime() - base.getTime()) / 86400000));
        const count = Math.min(12, Math.floor(spanDays / 7) + 1);
        return Array.from({ length: count }, (_, w) =>
            Array.from({ length: 7 }, (_, i) => {
                const d = new Date(base);
                d.setDate(base.getDate() + w * 7 + i);
                return d;
            })
        );
    }, [lastGroupIso]);
    const dotsByIso = useMemo(() => {
        const map: Record<string, string[]> = {};
        groups.forEach((g) => {
            map[g.iso] = g.items.slice(0, 3).map(() => "var(--accent)");
        });
        return map;
    }, [groups]);

    const goToDay = (iso: string) => {
        setSelectedIso(iso);
        document
            .getElementById(`day-${iso}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        // Briefly ring the day's cards after navigating via the strip.
        setHighlightIso(iso);
        if (highlightTimer.current) clearTimeout(highlightTimer.current);
        highlightTimer.current = setTimeout(() => setHighlightIso(null), 1200);
    };

    // When the strip pages to another week, jump the list to that week's first event.
    const goToWeek = (weekStartIso: string) => {
        const target = groups.find((g) => g.iso >= weekStartIso);
        if (target) goToDay(target.iso);
    };

    // Reverse sync: as the list scrolls vertically, highlight the visible day and
    // move the strip to its week. Guarded so it doesn't fight the strip → list sync.
    const groupKey = groups.map((g) => g.iso).join(",");
    useEffect(() => {
        if (!showStrip || !groups.length) return;
        const base = new Date();
        base.setHours(0, 0, 0, 0);
        const visible = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    const iso = (e.target as HTMLElement).dataset.iso;
                    if (!iso) return;
                    if (e.isIntersecting) visible.add(iso);
                    else visible.delete(iso);
                });
                const topIso = [...visible].sort()[0];
                if (!topIso) return;
                setSelectedIso(topIso);
                const week = Math.max(
                    0,
                    Math.floor((parseLocalDate(topIso).getTime() - base.getTime()) / (7 * 86400000))
                );
                setActiveWeek(week);
            },
            { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
        );
        groups.forEach((g) => {
            const el = document.getElementById(`day-${g.iso}`);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showStrip, groupKey]);

    const monthLabel = capitalize(
        new Date(`${selectedIso}T00:00`).toLocaleDateString("es-MX", { month: "long", year: "numeric" })
    );

    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Mobile: sticky week strip with the current month label */}
            {showStrip && (
                <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-2 backdrop-blur md:hidden">
                    <div className="mb-2 px-1 text-sm font-semibold">{monthLabel}</div>
                    <WeekStrip
                        weeks={weeks}
                        dotsByIso={dotsByIso}
                        selectedIso={selectedIso}
                        activeWeekIndex={activeWeek}
                        onSelect={goToDay}
                        onWeekChange={(_, weekStartIso) => goToWeek(weekStartIso)}
                    />
                </div>
            )}

            {/* Desktop: month calendar sidebar */}
            {showStrip && (
                <div className="hidden md:sticky md:top-[4.75rem] md:block md:w-72 md:shrink-0">
                    <MonthCalendar
                        dotsByIso={dotsByIso}
                        selectedIso={selectedIso}
                        onSelectDay={goToDay}
                    />
                </div>
            )}

            {/* Right: grouped list */}
            <div className="flex min-w-0 flex-1 flex-col gap-6">
            {loading && <p>Cargando...</p>}
            {!loading && groups.length > 0 && variant === "home" && (
                <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-h3">Agenda</h2>
                    <button
                        type="button"
                        onClick={() => navigate("/agenda")}
                        className="shrink-0 text-sm font-semibold"
                        style={{ color: "var(--accent)" }}
                    >
                        Ver todos
                    </button>
                </div>
            )}

            {groups.map((group) => {
                const isToday = group.iso === todayIso;
                const day = group.date.getDate();
                const weekdayFull = group.date.toLocaleDateString("es-MX", { weekday: "long" });
                const weekdayShort = capitalize(
                    group.date.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "")
                );
                const monthFull = group.date.toLocaleDateString("es-MX", { month: "long" });
                const count = group.items.length;
                return (
                    <div key={group.iso} id={`day-${group.iso}`} data-iso={group.iso} className="flex scroll-mt-24 flex-col gap-3">
                        <div className="flex items-baseline justify-between gap-2">
                            <h3 className="text-lg font-bold">
                                {isToday ? (
                                    <>
                                        <span style={{ color: "var(--accent)" }}>Hoy</span>{" "}
                                        <span className="text-base font-normal text-muted">
                                            {weekdayFull} {day} de {monthFull}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        {weekdayShort} {day}{" "}
                                        <span className="text-base font-normal text-muted">
                                            {monthFull}
                                        </span>
                                    </>
                                )}
                            </h3>
                            <span className="shrink-0 text-sm text-muted">
                                {count} {count === 1 ? "evento" : "eventos"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-4">
                            {group.items.map(({ post, time }) => (
                                <EventCard
                                    key={post._id}
                                    event={post}
                                    time={time}
                                    highlighted={showStrip && group.iso === highlightIso}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {hasMore && !loading && (
                <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {loadingMore ? "Loading..." : "Load More"}
                </button>
            )}
            </div>
        </div>
    )
}
