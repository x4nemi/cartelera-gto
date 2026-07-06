import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@gravity-ui/icons";
import { PostData } from "@/config/apiClient";
import { useRecurringEvents } from "@/hooks/useRecurringEvents";
import {
    isContinuousRun,
    parseLocalDate,
} from "@/utils/recurrence";
import { EventModal } from "@/components/eventModal";
import { Navbar } from "@/components/navbar";
import { colorForTag } from "@/utils/tagColors";

const DOW_LABEL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Local "YYYY-MM-DD" for a Date (matches how event dates are stored). */
const toISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Cierra <hoy|mañana|el D mmm>" when the event ends within the next week. */
const closesSoon = (event: PostData): string | null => {
    let end: Date | null = null;
    if (event.endsOn) {
        const d = parseLocalDate(event.endsOn);
        if (!Number.isNaN(d.getTime())) end = d;
    } else if (isContinuousRun(event.dates)) {
        const times = (event.dates ?? [])
            .map((d) => parseLocalDate(d).getTime())
            .filter((t) => !Number.isNaN(t));
        if (times.length) end = new Date(Math.max(...times));
    }
    if (!end) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((end.getTime() - today.getTime()) / 86400000);
    if (diff < 0 || diff > 7) return null;

    const rel =
        diff === 0
            ? "hoy"
            : diff === 1
                ? "mañana"
                : `el ${end
                    .toLocaleDateString("es-MX", { day: "numeric", month: "short" })
                    .replace(".", "")}`;
    return `Cierra ${rel}`;
};

export const RecurringAll = () => {
    const { posts, loading } = useRecurringEvents();
    const navigate = useNavigate();
    const [category, setCategory] = useState<string>("todas");
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
                isToday: i === 0,
            };
        });
    }, []);

    const categories = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
        return [...set];
    }, [posts]);

    const filtered = useMemo(
        () =>
            category === "todas"
                ? posts
                : posts.filter((p) => p.tags?.includes(category)),
        [posts, category]
    );

    // Place each event's sessions on the exact upcoming dates (with time) it occurs.
    const sessionsByIso = useMemo(() => {
        const map = new Map<string, { event: PostData; time: string | null }[]>();
        days.forEach((d) => map.set(d.iso, []));
        filtered.forEach((event) => {
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
    }, [filtered, days]);

    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-28">
            <div className="mx-auto mb-3 flex flex-col w-full max-w-6xl justify-start">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex w-fit items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Regresar
                </button>

                <header className="flex flex-col gap-1">
                    <h1 className="text-h2">Recurrentes</h1>
                    <p className="text-sm text-muted">
                        Talleres, clases y actividades fijas
                    </p>
                </header>
            </div>

            <div className="flex flex-wrap gap-2">
                <FilterChip
                    label="Todas"
                    active={category === "todas"}
                    onSelect={() => setCategory("todas")}
                />
                {categories.map((cat) => (
                    <FilterChip
                        key={cat}
                        label={capitalize(cat)}
                        color={colorForTag(cat)}
                        active={category === cat}
                        onSelect={() => setCategory(cat)}
                    />
                ))}
            </div>

            {loading && <p className="text-muted">Cargando...</p>}

            <div className="min-h-0 flex-1 overflow-auto pb-2">
                <div className="grid h-full grid-flow-col auto-cols-[190px] gap-3">
                    {days.map((day) => {
                        const isToday = day.isToday;
                        const daySessions = sessionsByIso.get(day.iso) ?? [];
                        return (
                            <div
                                key={day.iso}
                                className="flex flex-col gap-3 rounded-2xl p-1"
                                style={
                                    isToday
                                        ? {
                                            backgroundColor:
                                                "color-mix(in oklch, var(--accent) 8%, transparent)",
                                        }
                                        : undefined
                                }
                            >
                                <div className="pb-1 text-center text-sm font-medium">
                                    {isToday ? (
                                        <span style={{ color: "var(--accent)" }}>
                                            {day.label} · hoy
                                        </span>
                                    ) : (
                                        <span className="text-muted">{day.label}</span>
                                    )}
                                </div>

                                {daySessions.length === 0 ? (
                                    <div className="flex min-h-[92px] items-center justify-center rounded-2xl border border-dashed border-default-200 px-2 text-center text-xs text-muted">
                                        Sin actividades
                                    </div>
                                ) : (
                                    daySessions.map(({ event, time }) => {
                                        const closes = closesSoon(event);
                                        return (
                                            <button
                                                key={`${day.iso}-${event._id}-${time ?? ""}`}
                                                type="button"
                                                onClick={() => setSelected(event)}
                                                className="flex flex-col items-start gap-1 rounded-2xl border border-default-200 bg-surface p-3 text-left transition-colors hover:border-default-300"
                                            >
                                                {event.tags && event.tags.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        {event.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="size-2 rounded-full"
                                                                style={{ backgroundColor: colorForTag(tag) }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                <span className="text-sm font-semibold leading-snug">
                                                    {event.title}
                                                </span>
                                                {time && (
                                                    <span className="text-xs font-medium text-muted">
                                                        {time}
                                                    </span>
                                                )}
                                                {closes && (
                                                    <span
                                                        className="mt-1 rounded-full px-2 py-0.5 text-xs font-medium"
                                                        style={{
                                                            backgroundColor:
                                                                "color-mix(in oklch, var(--accent) 15%, transparent)",
                                                            color: "var(--accent)",
                                                        }}
                                                    >
                                                        {closes}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })
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

interface FilterChipProps {
    label: string;
    active: boolean;
    color?: string;
    onSelect: () => void;
}

const FilterChip = ({ label, active, color, onSelect }: FilterChipProps) => (
    <button
        type="button"
        onClick={onSelect}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${active
            ? "border-transparent text-white"
            : "border-default-200 text-foreground hover:border-default-300"
            }`}
        style={active ? { backgroundColor: "var(--accent)" } : undefined}
    >
        {color && (
            <span
                className="size-2 rounded-full"
                style={{ backgroundColor: color }}
            />
        )}
        {label}
    </button>
);
