import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "@gravity-ui/icons";

const DOW = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface MonthCalendarProps {
    /** Dot colors per ISO day (one per event, capped by the caller). */
    dotsByIso: Record<string, string[]>;
    /** Highlighted day (ISO). */
    selectedIso?: string;
    /** Fired when a day that has events is clicked. */
    onSelectDay: (iso: string) => void;
}

/**
 * Month calendar for the desktop agenda: marks days that have events with dots,
 * highlights today and the selected day, and follows the list's selected day.
 */
export const MonthCalendar = ({ dotsByIso, selectedIso, onSelectDay }: MonthCalendarProps) => {
    const [month, setMonth] = useState(() => {
        const d = selectedIso ? new Date(`${selectedIso}T00:00`) : new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    // Follow the list: jump the calendar to the month of the visible day.
    useEffect(() => {
        if (!selectedIso) return;
        const d = new Date(`${selectedIso}T00:00`);
        setMonth((m) =>
            m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth()
                ? m
                : new Date(d.getFullYear(), d.getMonth(), 1)
        );
    }, [selectedIso]);

    const todayIso = toIso(new Date());
    const year = month.getFullYear();
    const mon = month.getMonth();
    const firstDow = new Date(year, mon, 1).getDay();
    const daysInMonth = new Date(year, mon + 1, 0).getDate();

    const cells: { date: Date; inMonth: boolean }[] = [];
    for (let i = 0; i < firstDow; i++) {
        cells.push({ date: new Date(year, mon, 1 - (firstDow - i)), inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ date: new Date(year, mon, d), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
        const last = cells[cells.length - 1].date;
        cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }

    const title = capitalize(month.toLocaleDateString("es-MX", { month: "long", year: "numeric" }));

    return (
        <div className="rounded-2xl border border-default-200 bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">{title}</h3>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Mes anterior"
                        onClick={() => setMonth(new Date(year, mon - 1, 1))}
                        className="flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-default-100 hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Mes siguiente"
                        onClick={() => setMonth(new Date(year, mon + 1, 1))}
                        className="flex size-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-default-100 hover:text-foreground"
                    >
                        <ArrowRight className="size-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
                {DOW.map((d) => (
                    <span key={d} className="py-1">
                        {d}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map(({ date, inMonth }) => {
                    const iso = toIso(date);
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
                            onClick={() => hasEvents && onSelectDay(iso)}
                            className="relative flex aspect-square items-center justify-center rounded-full text-sm transition-colors enabled:hover:bg-default-100 disabled:cursor-default"
                            style={{
                                backgroundColor: isToday
                                    ? "var(--accent)"
                                    : isSelected
                                        ? "color-mix(in oklch, var(--accent) 16%, transparent)"
                                        : undefined,
                                color: isToday
                                    ? "var(--accent-foreground)"
                                    : !inMonth
                                        ? "var(--muted)"
                                        : undefined,
                                opacity: !inMonth ? 0.5 : 1,
                                fontWeight: hasEvents ? 700 : 400,
                            }}
                        >
                            {date.getDate()}
                            {hasEvents && !isToday && (
                                <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                                    {dots.slice(0, 3).map((c, i) => (
                                        <span
                                            key={i}
                                            className="size-1 rounded-full"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
