import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
// Week starts Monday → L M M J V S D
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
// Mobile strip weekday labels (Mon..Sun)
const WEEKDAYS_LONG = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

const toKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

// Returns the Monday on/before the given date.
const startOfWeek = (d: Date) => {
    const result = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dow = (result.getDay() + 6) % 7; // Mon=0..Sun=6
    result.setDate(result.getDate() - dow);
    return result;
};

const addDays = (d: Date, n: number) => {
    const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    r.setDate(r.getDate() + n);
    return r;
};

export interface MonthCalendarProps {
    /** Currently visible month (any date inside that month). */
    viewMonth: Date;
    onViewMonthChange: (date: Date) => void;
    /** Selected date (highlighted). */
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    /** Set of YYYY-MM-DD keys for days that have at least one event. */
    eventDates: Set<string>;
    /** Optional controlled expanded state (no-op now; kept for API compat). */
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
}

export const MonthCalendar = ({
    viewMonth,
    onViewMonthChange,
    selectedDate,
    onSelectDate,
    eventDates,
}: MonthCalendarProps) => {
    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const monthStart = startOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart);

    // Desktop: only the weeks that overlap the visible month (typically 5,
    // up to 6 when the month spans six calendar weeks).
    const weeks: Date[][] = useMemo(() => {
        const all = Array.from({ length: 6 }, (_, w) =>
            Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)),
        );
        return all.filter((week) =>
            week.some((d) => d.getMonth() === viewMonth.getMonth()),
        );
    }, [gridStart, viewMonth]);

    // Mobile strip: every day in the visible month.
    // (Replaced by weekly snap rendering below; kept removed.)

    // Mobile: weeks (Mon..Sun) overlapping the visible month, so each
    // horizontal scroll page is a full week aligned to Monday.
    const mobileWeeks: Date[][] = useMemo(() => {
        const result: Date[][] = [];
        for (let w = 0; w < 6; w++) {
            const week = Array.from({ length: 7 }, (_, d) =>
                addDays(gridStart, w * 7 + d),
            );
            // Drop weeks fully outside the visible month.
            const anyInMonth = week.some(
                (d) => d.getMonth() === viewMonth.getMonth(),
            );
            if (anyInMonth) result.push(week);
        }
        return result;
    }, [gridStart, viewMonth]);

    // Auto-scroll the mobile strip so the week containing the selected day
    // (or, if not in this month, the week containing today, or the first
    // week with any non-past day) is shown.
    const stripRef = useRef<HTMLDivElement>(null);
    const targetWeekIdx = useMemo(() => {
        const idxSelected = mobileWeeks.findIndex((w) =>
            w.some((d) => isSameDay(d, selectedDate)),
        );
        if (idxSelected !== -1) return idxSelected;
        const idxToday = mobileWeeks.findIndex((w) =>
            w.some((d) => isSameDay(d, today)),
        );
        if (idxToday !== -1) return idxToday;
        const idxFirstFuture = mobileWeeks.findIndex((w) =>
            w.some((d) => d >= today),
        );
        return idxFirstFuture === -1 ? 0 : idxFirstFuture;
    }, [mobileWeeks, selectedDate, today]);

    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        // Each week panel is full-width of the strip.
        strip.scrollTo({ left: strip.clientWidth * targetWeekIdx, behavior: "smooth" });
    }, [targetWeekIdx]);

    // Track whether the strip can scroll further left/right, to fade the
    // edge gradient hints accordingly.
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const update = () => {
            setCanScrollLeft(strip.scrollLeft > 1);
            setCanScrollRight(
                strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1,
            );
        };
        update();
        strip.addEventListener("scroll", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(strip);
        return () => {
            strip.removeEventListener("scroll", update);
            ro.disconnect();
        };
    }, [mobileWeeks.length]);

    const handlePrev = () => {
        const prev = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
        onViewMonthChange(prev);
    };
    const handleNext = () => {
        const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
        onViewMonthChange(next);
    };

    const isCurrentOrPastMonth =
        viewMonth.getFullYear() < today.getFullYear() ||
        (viewMonth.getFullYear() === today.getFullYear() &&
            viewMonth.getMonth() <= today.getMonth());

    return (
        <div className="bg-content1 p-3 select-none rounded-none md:rounded-4xl shadow-sm md:shadow-none">
            {/* Header */}
            <div className="flex items-center justify-between px-1 mb-3">
                {isCurrentOrPastMonth ? (
                    <span className="w-8" aria-hidden />
                ) : (
                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        size="sm"
                        aria-label="Mes anterior"
                        onPress={handlePrev}
                    >
                        <ChevronLeftIcon size={20} />
                    </Button>
                )}
                <span className="md:text-lead text-h2 ">
                    {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </span>
                <Button
                    isIconOnly
                    variant="light"
                    radius="full"
                    size="sm"
                    aria-label="Mes siguiente"
                    onPress={handleNext}
                >
                    <ChevronRightIcon size={20} />
                </Button>
            </div>

            {/* Mobile: horizontally scrolling weeks (snap per week) */}
            <div className="md:hidden relative">
                <div
                    ref={stripRef}
                    className="flex overflow-x-auto px-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                {mobileWeeks.map((week, weekIdx) => {
                    return (
                        <div
                            key={weekIdx}
                            className="flex-shrink-0 w-full snap-start grid grid-cols-7 gap-1"
                        >
                            {week.map((d) => {
                                const dow = (d.getDay() + 6) % 7; // Mon=0..Sun=6
                                const inMonth = d.getMonth() === viewMonth.getMonth();
                                const isToday = isSameDay(d, today);
                                const isSelected = isSameDay(d, selectedDate);
                                const hasEvent = eventDates.has(toKey(d));
                                const isPast = d < today;
                                // Past days (in or out of month) are not selectable.
                                // Out-of-month future days ARE selectable; clicking them
                                // flips the view to that month (handled by parent via
                                // onSelectDate).
                                const disabled = isPast;
                                return (
                                    <button
                                        key={toKey(d)}
                                        type="button"
                                        onClick={() => onSelectDate(d)}
                                        disabled={disabled}
                                        className={[
                                            "relative flex flex-col items-center justify-center gap-1 py-3 rounded-2xl transition-colors",
                                            disabled ? "opacity-30 cursor-default" : "",
                                            !disabled && !inMonth ? "opacity-50" : "",
                                            isSelected
                                                ? "bg-default-200"
                                                : !disabled
                                                    ? "hover:bg-default-100"
                                                    : "",
                                        ].join(" ")}
                                        aria-label={d.toDateString()}
                                        aria-pressed={isSelected}
                                    >
                                        <span className="text-[11px] font-semibold tracking-wide text-foreground/60">
                                            {WEEKDAYS_LONG[dow]}
                                        </span>
                                        <span
                                            className={[
                                                "text-2xl leading-none",
                                                isToday
                                                    ? "text-primary font-bold"
                                                    : isSelected
                                                        ? "font-semibold"
                                                        : "text-foreground",
                                            ].join(" ")}
                                        >
                                            {d.getDate()}
                                        </span>
                                        <span
                                            className={[
                                                "w-1 h-1 rounded-full",
                                                hasEvent ? "bg-foreground/40" : "bg-transparent",
                                            ].join(" ")}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
                </div>

                {/* Edge fade hints — show only when scroll is possible in that direction */}
                <div
                    aria-hidden
                    className={[
                        "pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-content1 to-transparent rounded-l-3xl transition-opacity duration-200",
                        canScrollLeft ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                />
                <div
                    aria-hidden
                    className={[
                        "pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-content1 to-transparent rounded-r-3xl transition-opacity duration-200",
                        canScrollRight ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                />
            </div>

            {/* Desktop: full month grid */}
            <div className="hidden md:block">
                {/* Weekday row */}
                <div className="grid grid-cols-7 gap-1 px-1 mb-2">
                    {WEEKDAYS.map((w, i) => (
                        <div
                            key={i}
                            className="text-center text-[13px] font-bold text-foreground/60"
                        >
                            {w}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="px-1 overflow-hidden">
                    {weeks.map((week, weekIdx) => (
                        <motion.div
                            key={weekIdx}
                            className="grid grid-cols-7 gap-1 overflow-hidden"
                            initial={false}
                            animate={{ marginTop: weekIdx > 0 ? 4 : 0 }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], bounce: .25 }}
                        >
                            {week.map((d) => {
                                const inMonth = d.getMonth() === viewMonth.getMonth();
                                const isToday = isSameDay(d, today);
                                const isSelected = isSameDay(d, selectedDate);
                                const hasEvent = eventDates.has(toKey(d));
                                const isPast = d < today;
                                return (
                                    <button
                                        key={toKey(d)}
                                        type="button"
                                        onClick={() => onSelectDate(d)}
                                        disabled={isPast}
                                        className={[
                                            "relative aspect-square flex items-center justify-center rounded-full text-sm transition-colors",
                                            isPast ? "opacity-30 cursor-default" : "",
                                            !isPast && !inMonth ? "opacity-50" : "",
                                            isSelected
                                                ? "bg-primary text-primary-foreground font-semibold"
                                                : isToday
                                                    ? "font-bold text-primary"
                                                    : "text-foreground hover:bg-default-200",
                                        ].join(" ")}
                                        aria-label={d.toDateString()}
                                        aria-pressed={isSelected}
                                    >
                                        {d.getDate()}
                                        {hasEvent && (
                                            <span
                                                className={[
                                                    "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                                                    isSelected ? "bg-primary-foreground" : "bg-primary",
                                                ].join(" ")}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
