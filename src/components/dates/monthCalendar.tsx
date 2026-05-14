import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { motion, animate } from "motion/react";
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
        strip.scrollTo({
            left: strip.clientWidth * targetWeekIdx,
            behavior: "smooth",
        });
    }, [targetWeekIdx]);

    const innerRef = useRef<HTMLDivElement>(null);

    // Rubber-band effect at the strip edges: when the user pulls past the
    // first or last week, translate the inner container by a damped amount
    // and spring it back on release.
    useEffect(() => {
        const strip = stripRef.current;
        const inner = innerRef.current;
        if (!strip || !inner) return;

        let startX: number | null = null;
        let startScroll = 0;
        let offset = 0;

        const onTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            startScroll = strip.scrollLeft;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (startX === null) return;
            const dx = e.touches[0].clientX - startX;
            const max = strip.scrollWidth - strip.clientWidth;
            const atLeft = startScroll <= 0 && dx > 0;
            const atRight = startScroll >= max - 1 && dx < 0;
            if (atLeft || atRight) {
                e.preventDefault();
                // Diminishing returns, capped so it never feels infinite.
                const damped = Math.sign(dx) * Math.min(80, Math.abs(dx) / 2.5);
                offset = damped;
                inner.style.transform = `translateX(${damped}px)`;
            }
        };

        const onTouchEnd = () => {
            startX = null;
            if (offset !== 0) {
                const from = offset;
                offset = 0;
                animate(from, 0, {
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                    onUpdate: (v) => {
                        inner.style.transform = `translateX(${v}px)`;
                    },
                    onComplete: () => {
                        inner.style.transform = "";
                    },
                });
            }
        };

        strip.addEventListener("touchstart", onTouchStart, { passive: true });
        strip.addEventListener("touchmove", onTouchMove, { passive: false });
        strip.addEventListener("touchend", onTouchEnd, { passive: true });
        strip.addEventListener("touchcancel", onTouchEnd, { passive: true });
        return () => {
            strip.removeEventListener("touchstart", onTouchStart);
            strip.removeEventListener("touchmove", onTouchMove);
            strip.removeEventListener("touchend", onTouchEnd);
            strip.removeEventListener("touchcancel", onTouchEnd);
        };
    }, []);

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

    const prevMonthName =
        MONTH_NAMES[(viewMonth.getMonth() + 11) % 12];
    const nextMonthName =
        MONTH_NAMES[(viewMonth.getMonth() + 1) % 12];

    return (
        <div className="bg-content1/90 backdrop-blur-md p-3 select-none rounded-none rounded-b-4xl max-md:border-t-0 border border-default md:rounded-4xl shadow-sm md:shadow-none">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-1 mb-3">
                {isCurrentOrPastMonth ? (
                    <span className="w-20" aria-hidden />
                ) : (
                    <Button
                        variant="light"
                        radius="full"
                        size="sm"
                        aria-label={`Ir a ${prevMonthName}`}
                        onPress={handlePrev}
                        startContent={<ChevronLeftIcon size={16} />}
                        className="text-foreground/70 font-medium px-2 min-w-0"
                    >
                        {prevMonthName}
                    </Button>
                )}
                <span className="md:text-lead text-h2 text-center flex-1">
                    {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </span>
                <Button
                    variant="light"
                    radius="full"
                    size="sm"
                    aria-label={`Ir a ${nextMonthName}`}
                    onPress={handleNext}
                    endContent={<ChevronRightIcon size={16} />}
                    className="text-foreground/70 font-medium px-2 min-w-0"
                >
                    {nextMonthName}
                </Button>
            </div>

            {/* Mobile: horizontally scrolling weeks (snap per week) */}
            <div className="md:hidden relative">
                <div
                    ref={stripRef}
                    className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                <div ref={innerRef} className="flex will-change-transform">
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
                                            "group relative flex flex-col items-center justify-center gap-1.5 py-2 transition-colors",
                                            disabled ? "opacity-30 cursor-default" : "",
                                            !disabled && !inMonth ? "opacity-50" : "",
                                        ].join(" ")}
                                        aria-label={d.toDateString()}
                                        aria-pressed={isSelected}
                                    >
                                        <span className="text-[11px] font-semibold tracking-wide text-foreground/60">
                                            {WEEKDAYS_LONG[dow]}
                                        </span>
                                        <span
                                            className={[
                                                "flex items-center justify-center size-9 rounded-full text-base leading-none transition-colors",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground font-semibold"
                                                    : isToday
                                                        ? "text-primary font-bold group-hover:bg-primary/10"
                                                        : "text-foreground group-hover:bg-default-200/60",
                                            ].join(" ")}
                                        >
                                            {d.getDate()}
                                        </span>
                                        <span
                                            className={[
                                                "w-1 h-1 rounded-full",
                                                hasEvent
                                                    ? isSelected
                                                        ? "bg-primary"
                                                        : "bg-foreground/40"
                                                    : "bg-transparent",
                                            ].join(" ")}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
                </div>
                </div>
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
