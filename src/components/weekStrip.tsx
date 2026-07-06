import { useEffect, useRef } from "react";

const DOW_LABEL = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export interface WeekStripProps {
    /** One entry per week; each week is an array of 7 Dates. */
    weeks: Date[][];
    /** Dot colors per ISO day (one per event, already capped by the caller). */
    dotsByIso: Record<string, string[]>;
    /** Currently highlighted day (ISO). */
    selectedIso?: string;
    /** Week the strip should be showing (kept in sync with the list's vertical scroll). */
    activeWeekIndex?: number;
    /** Fired when a day with events is tapped. */
    onSelect: (iso: string) => void;
    /** Fired when the strip is scrolled onto a different week (index + that week's start ISO). */
    onWeekChange?: (weekIndex: number, weekStartIso: string) => void;
}

/**
 * Horizontal week strip that pages one week at a time (scroll-snap). Each pill
 * shows the weekday, day number, and colored dots for the events that day.
 * Scrolling to the next week notifies the parent so the list can follow, and it
 * follows back when `activeWeekIndex` changes from the list's vertical scroll.
 */
export const WeekStrip = ({
    weeks,
    dotsByIso,
    selectedIso,
    activeWeekIndex,
    onSelect,
    onWeekChange,
}: WeekStripProps) => {
    const todayIso = toIso(new Date());
    const scrollerRef = useRef<HTMLDivElement>(null);
    const currentWeek = useRef(0);
    const suppress = useRef(false);

    const handleScroll = () => {
        const el = scrollerRef.current;
        if (!el || !el.clientWidth || suppress.current) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        if (idx !== currentWeek.current && weeks[idx]) {
            currentWeek.current = idx;
            onWeekChange?.(idx, toIso(weeks[idx][0]));
        }
    };

    // Follow the list: when the visible week changes, page the strip to it.
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el || activeWeekIndex == null || !el.clientWidth) return;
        const cur = Math.round(el.scrollLeft / el.clientWidth);
        if (cur === activeWeekIndex) return;
        suppress.current = true;
        currentWeek.current = activeWeekIndex;
        el.scrollTo({ left: activeWeekIndex * el.clientWidth, behavior: "smooth" });
        const t = setTimeout(() => {
            suppress.current = false;
        }, 500);
        return () => clearTimeout(t);
    }, [activeWeekIndex]);

    return (
        <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {weeks.map((week, wi) => (
                <div
                    key={wi}
                    className="grid w-full shrink-0 snap-start grid-cols-7 gap-2 pb-1"
                >
                    {week.map((d) => {
                        const iso = toIso(d);
                        const isToday = iso === todayIso;
                        const isSelected = iso === selectedIso;
                        const dots = dotsByIso[iso] ?? [];
                        const hasEvents = dots.length > 0;

                        return (
                            <button
                                key={iso}
                                type="button"
                                disabled={!hasEvents}
                                aria-current={isSelected ? "date" : undefined}
                                onClick={() => hasEvents && onSelect(iso)}
                                className="flex min-w-0 flex-col items-center gap-1 rounded-2xl border px-0.5 py-2.5 transition-colors disabled:cursor-default md:rounded-xl md:py-2 md:hover:border-default-300"
                                style={{
                                    backgroundColor: isToday
                                        ? "var(--accent)"
                                        : isSelected
                                            ? "color-mix(in oklch, var(--accent) 14%, transparent)"
                                            : "var(--surface-secondary)",
                                    borderColor: isToday || isSelected ? "var(--accent)" : "var(--border)",
                                    color: isToday ? "var(--accent-foreground)" : undefined,
                                    opacity: !hasEvents && !isToday ? 0.5 : 1,
                                }}
                            >
                                <span className="text-[10px] font-bold uppercase leading-none">
                                    {isToday ? "HOY" : DOW_LABEL[d.getDay()]}
                                </span>
                                <span className="text-lg font-bold leading-none">{d.getDate()}</span>
                                <span className="flex h-1.5 items-center justify-center gap-0.5">
                                    {dots.map((c, i) => (
                                        <span
                                            key={i}
                                            className="size-1.5 rounded-full"
                                            style={{ backgroundColor: isToday ? "var(--accent-foreground)" : c }}
                                        />
                                    ))}
                                </span>
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
