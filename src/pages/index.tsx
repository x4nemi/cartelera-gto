import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Card, ScrollShadow, Skeleton, Surface } from "@heroui/react"
import { Magnifier, SquareListUl, ArrowsRotateLeft } from "@gravity-ui/icons"
import { InstagramLogoIcon } from "@phosphor-icons/react"

import { Navbar } from "@/components/navbar"
import { MiniEventCard } from "@/components/miniEventCard"
import { MiniRecurringCard } from "@/components/miniRecurringCard"
import { OrganizersMarquee } from "@/components/organizersMarquee"
import { useEvents } from "@/hooks/useEvents"
import { useRecurringEvents } from "@/hooks/useRecurringEvents"
import { parseLocalDate } from "@/utils/recurrence"
import { PostData } from "@/types"

const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/** Keep showing an event until this long after its start time. */
const GRACE_MS = 2 * 60 * 60 * 1000

/** Earliest still-relevant date (iso + time) for a post: a timed event stays
 *  until 2h after its start, a date-only event stays through the whole day. */
const getDisplay = (post: PostData, todayIso: string) => {
    const dates = [...(post.dates ?? [])].sort()
    if (dates.length === 0) return null
    const now = new Date()
    const isShowable = (d: string) => {
        const dayIso = d.slice(0, 10)
        if (dayIso > todayIso) return true
        if (dayIso < todayIso) return false
        const hasTime = d.length >= 16 && d[10] === "T"
        if (!hasTime) return true
        return now.getTime() < parseLocalDate(d).getTime() + GRACE_MS
    }
    const pick = dates.find(isShowable)
    if (!pick) return null
    const time = pick.length >= 16 && pick[10] === "T" ? pick.slice(11, 16) : null
    return { iso: pick.slice(0, 10), time }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "Mié 15 jul" label for upcoming cards shown across different days. */
const shortDate = (iso: string) => {
    const d = parseLocalDate(iso)
    const wd = d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "")
    const mo = d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")
    return `${capitalize(wd)} ${d.getDate()} ${mo}`
}

/** "dom 5 jul" for the "Hoy en Guanajuato" header. */
const todayLabel = () => {
    const d = new Date()
    const wd = d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "")
    const mo = d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")
    return `${wd} ${d.getDate()} ${mo}`
}

const ShortcutCard = ({
    icon: Icon,
    title,
    description,
    onClick,
}: {
    icon: (props: { className?: string }) => React.JSX.Element
    title: string
    description: string
    onClick: () => void
}) => (
    <Card
        variant="tertiary"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick()
            }
        }}
        className="cursor-pointer p-4 text-left transition-transform hover:scale-[1.01]"
    >
        <span
            className="mb-3 flex size-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "color-mix(in oklch, var(--accent) 14%, transparent)" }}
        >
            <Icon className="size-5" />
        </span>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
    </Card>
)

/** Loading placeholder mimicking a horizontal row of event cards. */
const CardRowSkeleton = ({ withImage = true }: { withImage?: boolean }) => (
    <section className="w-full text-left">
        <Skeleton className="mb-3 h-7 w-44 rounded-lg" />
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="w-56 shrink-0 rounded-2xl p-3 md:w-64"
                    style={{ backgroundColor: "var(--surface-tertiary)" }}
                >
                    {withImage ? (
                        <Skeleton className="h-32 w-full rounded-2xl md:h-36" />
                    ) : (
                        <Skeleton className="h-6 w-24 rounded-full" />
                    )}
                    <Skeleton className="mt-3 h-4 w-3/4 rounded" />
                    <Skeleton className="mt-2 h-3 w-1/2 rounded" />
                </div>
            ))}
        </div>
    </section>
)

export const Home = () => {
    const navigate = useNavigate()
    const { posts, loading: loadingEvents } = useEvents()
    const { posts: recurringPosts, loading: loadingRecurring } = useRecurringEvents()
    const [query, setQuery] = useState("")
    const todayIso = toIso(new Date())

    const withDisplay = posts
        .map((post) => ({ post, disp: getDisplay(post, todayIso) }))
        .filter((x): x is { post: PostData; disp: { iso: string; time: string | null } } => !!x.disp)

    const todays = withDisplay
        .filter((x) => x.disp.iso === todayIso)
        .sort((a, b) => (a.disp.time || "99:99").localeCompare(b.disp.time || "99:99"))

    // When there is nothing today, fall back to the three nearest upcoming events.
    const upcoming = [...withDisplay]
        .sort((a, b) =>
            `${a.disp.iso} ${a.disp.time || "99:99"}`.localeCompare(`${b.disp.iso} ${b.disp.time || "99:99"}`)
        )
        .slice(0, 3)

    // Three nearest upcoming recurring events (shown without images).
    const upcomingRecurring = recurringPosts
        .map((post) => ({ post, disp: getDisplay(post, todayIso) }))
        .filter((x): x is { post: PostData; disp: { iso: string; time: string | null } } => !!x.disp)
        .sort((a, b) =>
            `${a.disp.iso} ${a.disp.time || "99:99"}`.localeCompare(`${b.disp.iso} ${b.disp.time || "99:99"}`)
        )
        .slice(0, 3)

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const next = query.trim()
        navigate(next ? `/buscar?q=${encodeURIComponent(next)}` : "/buscar")
    }

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-12 overflow-x-hidden px-4 pb-28 pt-10 text-center md:gap-16 md:pt-28 lg:max-w-3xl">
            {/* Hero */}
            <div className="flex flex-col items-center gap-4">
                <span
                    className="text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: "var(--accent)" }}
                >
                    Cartelera Guanajuato
                </span>
                <h1 className="text-h1">
                    Todo lo que pasa en Guanajuato capital, en un solo lugar
                </h1>
                <p className="max-w-xl text-muted">
                    Conciertos, talleres, teatro y más. Hecha para la comunidad, no para el turismo.
                </p>
            </div>

            {/* Search */}
            <form onSubmit={submitSearch} className="relative w-full max-w-xl md:hidden">
                <Magnifier className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="¿Qué te interesa buscar?"
                    aria-label="Buscar eventos"
                    className="w-full rounded-full border border-default-200 bg-default-100/40 py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-default-300"
                />
            </form>

            {/* Shortcuts */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <ShortcutCard
                    icon={SquareListUl}
                    title="Agenda"
                    description="Los próximos eventos, día por día"
                    onClick={() => navigate("/agenda")}
                />
                <ShortcutCard
                    icon={ArrowsRotateLeft}
                    title="Recurrentes"
                    description="Talleres y clases de cada semana"
                    onClick={() => navigate("/recurrentes")}
                />
            </div>

            {/* Today's events */}
            {loadingEvents && <CardRowSkeleton />}
            {!loadingEvents && todays.length > 0 && (
                <section className="w-full text-left">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <h2 className="text-h3">
                            Hoy en Guanajuato{" "}
                            <span className="text-base font-normal" style={{ color: "var(--accent)" }}>
                                · {capitalize(todayLabel())}
                            </span>
                        </h2>
                        <button
                            type="button"
                            onClick={() => navigate("/agenda")}
                            className="shrink-0 text-sm font-semibold"
                            style={{ color: "var(--accent)" }}
                        >
                            Ver agenda
                        </button>
                    </div>
                    <ScrollShadow orientation="horizontal" className="pb-2">
                        <div className="flex gap-4">
                            {todays.map(({ post, disp }) => (
                                <MiniEventCard
                                    key={post._id ?? post.shortCode}
                                    event={post}
                                    time={disp.time}
                                />
                            ))}
                        </div>
                    </ScrollShadow>
                </section>
            )}

            {/* No events today: show the three nearest upcoming ones */}
            {!loadingEvents && todays.length === 0 && upcoming.length > 0 && (
                <section className="w-full text-left">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <h2 className="text-h3">Próximos eventos</h2>
                        <button
                            type="button"
                            onClick={() => navigate("/agenda")}
                            className="shrink-0 text-sm font-semibold"
                            style={{ color: "var(--accent)" }}
                        >
                            Ver agenda
                        </button>
                    </div>
                    <ScrollShadow orientation="horizontal" className="pb-2">
                        <div className="flex gap-4">
                            {upcoming.map(({ post, disp }) => (
                                <MiniEventCard
                                    key={post._id ?? post.shortCode}
                                    event={post}
                                    time={disp.time}
                                    dateLabel={shortDate(disp.iso)}
                                />
                            ))}
                        </div>
                    </ScrollShadow>
                </section>
            )}

            {/* Recurring events (image-less): three nearest upcoming */}
            {loadingRecurring && <CardRowSkeleton withImage={false} />}
            {!loadingRecurring && upcomingRecurring.length > 0 && (
                <section className="w-full text-left">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <h2 className="text-h3">Recurrentes</h2>
                        <button
                            type="button"
                            onClick={() => navigate("/recurrentes")}
                            className="shrink-0 text-sm font-semibold"
                            style={{ color: "var(--accent)" }}
                        >
                            Ver todos
                        </button>
                    </div>
                    <ScrollShadow orientation="horizontal" className="pb-2">
                        <div className="flex gap-4">
                            {upcomingRecurring.map(({ post, disp }) => (
                                <MiniRecurringCard
                                    key={post._id ?? post.shortCode}
                                    event={post}
                                    nextLabel={`${shortDate(disp.iso)}${disp.time ? ` · ${disp.time}` : ""}`}
                                />
                            ))}
                        </div>
                    </ScrollShadow>
                </section>
            )}

            {/* Organizers marquee */}
            <OrganizersMarquee />

            {/* Organizer banner */}
            <Surface
                variant="secondary"
                className="flex w-full items-center gap-4 rounded-3xl p-4 text-left"
            >
                <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: "color-mix(in oklch, var(--accent) 14%, transparent)" }}
                >
                    <InstagramLogoIcon className="size-6" style={{ color: "var(--accent)" }} weight="bold" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">¿Organizas eventos en Guanajuato?</p>
                    <p className="text-sm text-muted">
                        Contáctanos en Instagram y te ayudamos a publicar tus eventos en la cartelera. Es gratis.
                    </p>
                </div>
                <Button
                    className="shrink-0"
                    onPress={() =>
                        window.open(
                            "https://www.instagram.com/cartelera.gto",
                            "_blank",
                            "noopener,noreferrer"
                        )
                    }
                >
                    Contactar
                </Button>
            </Surface>

            <Navbar />
        </div>
    )
}
