import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@gravity-ui/icons";
import { PostData } from "@/config/apiClient";
import { useRecurringEvents } from "@/hooks/useRecurringEvents";
import {
    getRecurrenceDays,
    isContinuousRun,
    parseLocalDate,
} from "@/utils/recurrence";
import { EventModal } from "@/components/eventModal";
import { Navbar } from "@/components/navbar";

const WEEKDAYS = [
    { dow: 1, label: "Lun" },
    { dow: 2, label: "Mar" },
    { dow: 3, label: "Mié" },
    { dow: 4, label: "Jue" },
    { dow: 5, label: "Vie" },
    { dow: 6, label: "Sáb" },
    { dow: 0, label: "Dom" },
];

// Deterministic category colors for the leading dot on each card.
const CATEGORY_COLOR: Record<string, string> = {
    musica: "#3b82f6",
    taller: "#14b8a6",
    cine: "#f59e0b",
    arte: "#ec4899",
    gastronomia: "#f97316",
    danza: "#8b5cf6",
    teatro: "#ef4444",
    literatura: "#a855f7",
    conferencia: "#0ea5e9",
    exposicion: "#6366f1",
    festival: "#eab308",
    deporte: "#22c55e",
    infantil: "#d946ef",
    comunidad: "#84cc16",
    fiesta: "#f43f5e",
};
// Fallback palette so any unmapped tag still gets a distinct, stable color.
const PALETTE = [
    "#3b82f6", "#14b8a6", "#f59e0b", "#ec4899", "#f97316",
    "#8b5cf6", "#ef4444", "#a855f7", "#0ea5e9", "#6366f1",
    "#eab308", "#22c55e", "#d946ef", "#84cc16", "#f43f5e",
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const hashTag = (tag: string) => {
    let h = 0;
    for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
    return h;
};

const colorForTag = (tag: string) =>
    CATEGORY_COLOR[tag] ?? PALETTE[hashTag(tag) % PALETTE.length];

/** Weekdays (0=Sun..6=Sat) an ongoing event takes place on. */
const eventWeekdays = (event: PostData): number[] => {
    const recurring = getRecurrenceDays(event.dates);
    if (recurring) return recurring;
    const set = new Set<number>();
    (event.dates ?? []).forEach((d) => {
        const date = parseLocalDate(d);
        if (!Number.isNaN(date.getTime())) set.add(date.getDay());
    });
    return [...set];
};

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
    const todayDow = new Date().getDay();

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

    // Precompute weekday placement once per event set.
    const byDay = useMemo(() => {
        const map = new Map<number, PostData[]>();
        WEEKDAYS.forEach(({ dow }) => map.set(dow, []));
        filtered.forEach((event) => {
            eventWeekdays(event).forEach((dow) => map.get(dow)?.push(event));
        });
        return map;
    }, [filtered]);

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-28">
            <div className="mx-auto mb-3 flex flex-col w-full max-w-xl justify-start">
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

            <div className="overflow-x-auto pb-2">
                <div className="grid grid-flow-col auto-cols-[190px] gap-3">
                    {WEEKDAYS.map(({ dow, label }) => {
                        const isToday = dow === todayDow;
                        const dayEvents = byDay.get(dow) ?? [];
                        return (
                            <div
                                key={dow}
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
                                            {label} · hoy
                                        </span>
                                    ) : (
                                        <span className="text-muted">{label}</span>
                                    )}
                                </div>

                                {dayEvents.length === 0 ? (
                                    <div className="flex min-h-[92px] items-center justify-center rounded-2xl border border-dashed border-default-200 px-2 text-center text-xs text-muted">
                                        Sin actividades
                                    </div>
                                ) : (
                                    dayEvents.map((event) => {
                                        const closes = closesSoon(event);
                                        return (
                                            <button
                                                key={`${dow}-${event._id}`}
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
