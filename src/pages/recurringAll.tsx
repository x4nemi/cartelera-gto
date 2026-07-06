import { useMemo, useState } from "react";
import { PostData } from "@/config/apiClient";
import { useRecurringEvents } from "@/hooks/useRecurringEvents";
import { EventModal } from "@/components/eventModal";
import { Navbar } from "@/components/navbar";

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

    // Rolling 7-day window starting today; each column is a real date.
    const days = useMemo(() => {
        const base = new Date();
        base.setHours(0, 0, 0, 0);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(base);
            date.setDate(base.getDate() + i);
            return {
                iso: toISODate(date),
                label: DOW_LABEL[date.getDay()],
                dateShort: `${date.getDate()}/${date.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")}`,
                isToday: i === 0,
            };
        });
    }, []);

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
            <header className="flex flex-col gap-1">
                <h1 className="text-h2">Semanales</h1>
                <p className="text-sm text-muted">Talleres y clases que se repiten cada semana</p>
            </header>

            {loading && <p className="text-muted">Cargando...</p>}

            <div className="overflow-x-auto pb-2 md:overflow-visible">
                <div className="grid grid-flow-col auto-cols-[minmax(150px,1fr)] gap-3 md:grid-flow-row md:grid-cols-7">
                    {days.map((day) => {
                        const isToday = day.isToday;
                        const daySessions = sessionsByIso.get(day.iso) ?? [];
                        return (
                            <div key={day.iso} className="flex flex-col gap-3">
                                <div
                                    className="sticky top-0 z-10 pt-1 md:top-[4.75rem]"
                                    // style={{ backgroundColor: "var(--background)" }}
                                >
                                    <div className="pb-2">
                                        {isToday ? (
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
                                            <div
                                                className="rounded-xl px-3 py-2 text-center text-sm font-semibold text-muted"
                                            >
                                                {day.label} <span className="font-normal">{day.dateShort}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {daySessions.length === 0 ? (
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
