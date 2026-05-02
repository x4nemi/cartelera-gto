import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
// Week starts Monday → L M M J V S D
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

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
    /** Optional controlled expanded state. */
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
}

export const MonthCalendar = ({
    viewMonth,
    onViewMonthChange,
    selectedDate,
    onSelectDate,
    eventDates,
    expanded: expandedProp,
    onExpandedChange,
}: MonthCalendarProps) => {
    const [expandedInternal, setExpandedInternal] = useState(true);
    const expanded = expandedProp ?? expandedInternal;
    const setExpanded = (next: boolean) => {
        if (onExpandedChange) onExpandedChange(next);
        else setExpandedInternal(next);
    };

    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const monthStart = startOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart);

    // Always build 6 full weeks; we animate which rows are visible.
    const weeks: Date[][] = useMemo(() => {
        return Array.from({ length: 6 }, (_, w) =>
            Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)),
        );
    }, [gridStart]);

    const selectedWeekIdx = useMemo(() => {
        return weeks.findIndex((week) =>
            week.some((d) => isSameDay(d, selectedDate)),
        );
    }, [weeks, selectedDate]);

    const handlePrev = () => {
        const prev = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
        onViewMonthChange(prev);
    };
    const handleNext = () => {
        const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
        onViewMonthChange(next);
    };

    return (
        <div
            className={[
                "bg-content2 p-3 select-none transition-[border-radius] duration-300",
                expanded ? "rounded-3xl" : "rounded-t-3xl rounded-b-none",
            ].join(" ")}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-1 mb-2">
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
                <span className="text-sm font-medium capitalize">
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

            {/* Weekday row */}
            <div className="grid grid-cols-7 gap-1 px-1 mb-1">
                {WEEKDAYS.map((w, i) => (
                    <div
                        key={i}
                        className="text-center text-[11px] font-medium text-foreground/60"
                    >
                        {w}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="px-1 overflow-hidden">
                {weeks.map((week, weekIdx) => {
                    const isSelectedWeek = weekIdx === selectedWeekIdx;
                    const visible = expanded || isSelectedWeek;
                    return (
                        <motion.div
                            key={weekIdx}
                            className="grid grid-cols-7 gap-1 overflow-hidden"
                            initial={false}
                            animate={{
                                height: visible ? "auto" : 0,
                                opacity: visible ? 1 : 0,
                                marginTop: visible && weekIdx > 0 ? 4 : 0,
                            }}
                            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            aria-hidden={!visible}
                        >
                            {week.map((d) => {
                                const inMonth = d.getMonth() === viewMonth.getMonth();
                                const isToday = isSameDay(d, today);
                                const isSelected = isSameDay(d, selectedDate);
                                const hasEvent = eventDates.has(toKey(d));
                                return (
                                    <button
                                        key={toKey(d)}
                                        type="button"
                                        onClick={() => onSelectDate(d)}
                                        tabIndex={visible ? 0 : -1}
                                        className={[
                                            "relative aspect-square flex items-center justify-center rounded-full text-sm transition-colors",
                                            isSelected
                                                ? "bg-primary text-primary-foreground font-semibold"
                                                : isToday
                                                    ? "font-bold text-primary"
                                                    : inMonth
                                                        ? "text-foreground hover:bg-default-200"
                                                        : "text-foreground/30 hover:bg-default-200/60",
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
                    );
                })}
            </div>

            {/* Drag handle / collapse toggle (kept above the overlapping feed) */}
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="relative z-30 mt-2 mx-auto block py-1.5 px-6 rounded-full hover:bg-default-200/60 transition-colors"
                aria-label={expanded ? "Contraer calendario" : "Expandir calendario"}
                aria-expanded={expanded}
            >
                <span className="block w-10 h-1 bg-foreground/30 rounded-full" />
            </button>
        </div>
    );
};
