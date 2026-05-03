import { useEffect, useMemo, useRef, useState } from "react";
import { MonthCalendar } from "@/components/dates/monthCalendar";
import { EventCardLarge } from "@/components/card/eventCardLarge";
import { PostData } from "@/config/apiClient";

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const WEEKDAYS_LONG = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const parseLocalDate = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day);
};

const toKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const isSameMonth = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const CalendarFeed = ({ posts }: { posts: PostData[] }) => {
    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    // Build map: YYYY-MM-DD → posts that occur on that day.
    const postsByDay = useMemo(() => {
        const map = new Map<string, PostData[]>();
        posts.forEach((p) => {
            (p.dates ?? []).forEach((d) => {
                const key = toKey(parseLocalDate(d));
                const existing = map.get(key) ?? [];
                existing.push(p);
                map.set(key, existing);
            });
        });
        return map;
    }, [posts]);

    const eventDates = useMemo(() => new Set(postsByDay.keys()), [postsByDay]);

    // Sorted list of days with at least one event, ascending.
    const sortedDays = useMemo(() => {
        return Array.from(postsByDay.keys())
            .map((k) => parseLocalDate(k))
            .sort((a, b) => a.getTime() - b.getTime());
    }, [postsByDay]);

    // Default selected = today if any events today, else next future day, else last past day, else today.
    const defaultSelected = useMemo(() => {
        if (eventDates.has(toKey(today))) return today;
        const future = sortedDays.find((d) => d >= today);
        if (future) return future;
        if (sortedDays.length > 0) return sortedDays[sortedDays.length - 1];
        return today;
    }, [eventDates, sortedDays, today]);

    const [selectedDate, setSelectedDate] = useState<Date>(defaultSelected);
    // Anchor used only for filtering which day sections to render. Updated on
    // click (so users can jump forward) but NOT on scroll, so past day sections
    // don't unmount and cause layout jumps as the highlighted day advances.
    const [anchorDate, setAnchorDate] = useState<Date>(defaultSelected);
    const [viewMonth, setViewMonth] = useState<Date>(defaultSelected);
    const [calendarExpanded, setCalendarExpanded] = useState(true);

    // Auto-collapse the calendar when the user scrolls down; expand when at top.
    // Mobile only — on desktop the calendar stays expanded.
    useEffect(() => {
        const mql = window.matchMedia("(min-width: 768px)");
        const onScroll = () => {
            if (mql.matches) {
                setCalendarExpanded(true);
                return;
            }
            if (window.scrollY > 24) setCalendarExpanded(false);
            else setCalendarExpanded(true);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        mql.addEventListener("change", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            mql.removeEventListener("change", onScroll);
        };
    }, []);

    // Re-sync defaults when posts arrive.
    useEffect(() => {
        setSelectedDate((cur) => (cur.getTime() === today.getTime() ? defaultSelected : cur));
        setAnchorDate((cur) => (cur.getTime() === today.getTime() ? defaultSelected : cur));
        setViewMonth((cur) => (isSameMonth(cur, today) ? defaultSelected : cur));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultSelected.getTime()]);

    // Refs for each day section, to enable scroll-into-view + intersection sync.
    const sectionRefs = useRef(new Map<string, HTMLElement>());
    const suppressObserverUntil = useRef<number>(0);

    const setSectionRef = (key: string) => (el: HTMLElement | null) => {
        if (el) sectionRefs.current.set(key, el);
        else sectionRefs.current.delete(key);
    };

    // When the user picks a date in the calendar, scroll to the matching (or
    // next-available) section. If no event on/after that date, do nothing.
    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
        setAnchorDate(date);
        if (!isSameMonth(date, viewMonth)) setViewMonth(date);

        const target =
            postsByDay.has(toKey(date))
                ? date
                : sortedDays.find((d) => d >= date);
        if (!target) return;
        const key = toKey(target);
        const el = sectionRefs.current.get(key);
        if (!el) return;
        suppressObserverUntil.current = Date.now() + 800;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Scroll → calendar sync via IntersectionObserver. Updates the highlighted
    // day and visible month based on which section is currently in view.
    // anchorDate is intentionally NOT updated here, to avoid unmounting past
    // day sections (which would cause layout jumps).
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (Date.now() < suppressObserverUntil.current) return;
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length === 0) return;
                const key = (visible[0].target as HTMLElement).dataset.dayKey;
                if (!key) return;
                const date = parseLocalDate(key);
                setSelectedDate((cur) => (cur.getTime() === date.getTime() ? cur : date));
                setViewMonth((cur) => (isSameMonth(cur, date) ? cur : date));
            },
            { rootMargin: "-10% 0px -85% 0px", threshold: 0 },
        );
        sectionRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [postsByDay, anchorDate]);

    // Days to render: only days >= anchorDate that have events. anchorDate is
    // pinned by clicks (not scroll), so the rendered set is stable while
    // scrolling.
    const visibleDays = useMemo(
        () => sortedDays.filter((d) => d >= anchorDate),
        [sortedDays, anchorDate],
    );

    if (sortedDays.length === 0) {
        return (
            <div className="flex flex-col w-full md:flex-row md:gap-6 md:items-start">
                <div className="w-full md:w-72 md:flex-shrink-0 sticky top-0 md:top-24 z-30 bg-background">
                    <MonthCalendar
                        viewMonth={viewMonth}
                        onViewMonthChange={setViewMonth}
                        selectedDate={selectedDate}
                        onSelectDate={handleSelectDate}
                        eventDates={eventDates}
                        expanded={calendarExpanded}
                        onExpandedChange={setCalendarExpanded}
                    />
                </div>
                <p className="text-center text-foreground/60 py-10 md:flex-1 relative z-10 bg-background">
                    No hay eventos para mostrar.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full md:flex-row md:gap-6 md:items-start">
            {/* Calendar: sticky on top of the feed on all breakpoints so it stays visible while scrolling. */}
            <div className="w-full md:w-72 md:flex-shrink-0 sticky top-0 md:top-24 z-30 bg-background">
                <MonthCalendar
                    viewMonth={viewMonth}
                    onViewMonthChange={setViewMonth}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    eventDates={eventDates}
                    expanded={calendarExpanded}
                    onExpandedChange={setCalendarExpanded}
                />
            </div>

            {/* Right column: month header + day sections. Lower z-index so the sticky calendar above stays visible as content scrolls underneath. */}
            <div className="flex flex-col gap-3 md:flex-1 min-w-0 relative z-10 pt-4 md:pt-0">
                {visibleDays.length === 0 ? (
                    <p className="text-center text-foreground/60 py-10">
                        No hay eventos a partir de esta fecha.
                    </p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {visibleDays.map((d) => {
                            const key = toKey(d);
                            const dayPosts = postsByDay.get(key) ?? [];
                            return (
                                <section
                                    key={key}
                                    ref={setSectionRef(key)}
                                    data-day-key={key}
                                    className="flex flex-col gap-2 scroll-mt-24"
                                >
                                    <h3 className="text-base font-medium text-foreground/80 capitalize px-1">
                                        {WEEKDAYS_LONG[d.getDay()]} {d.getDate()} de{" "}
                                        {MONTH_NAMES[d.getMonth()].toLowerCase()}
                                    </h3>
                                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                                        {dayPosts.map((p) => (
                                            <EventCardLarge key={`${key}-${p.shortCode}`} {...p} />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
