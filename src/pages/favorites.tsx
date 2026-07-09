import { Chip } from "@heroui/react"

import { EventCard } from "@/components/eventCard"
import { Navbar } from "@/components/navbar"
import { useLikedEvents } from "@/hooks/useLikedEvents"
import { parseLocalDate } from "@/utils/recurrence"
import { PostData } from "@/types"

const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/** Keep showing an event until this long after its start time. */
const GRACE_MS = 2 * 60 * 60 * 1000

/** Earliest still-relevant date (iso + time) for a post, or null once every date
 *  has passed (a timed event lingers 2h after its start, a date-only one all day). */
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

/** "Sáb 11 jul" label for a card. */
const shortDateLabel = (iso: string) => {
    const d = parseLocalDate(iso)
    if (Number.isNaN(d.getTime())) return null
    const wd = d.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "")
    const mo = d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")
    return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${d.getDate()} ${mo}`
}

export const Favorites = () => {
    const likedEvents = useLikedEvents()
    const todayIso = toIso(new Date())

    // Only keep liked events that haven't fully passed, nearest first.
    const upcoming = likedEvents
        .map((event) => ({ event, disp: getDisplay(event, todayIso) }))
        .filter((x): x is { event: PostData; disp: { iso: string; time: string | null } } => !!x.disp)
        .sort((a, b) =>
            `${a.disp.iso} ${a.disp.time || "99:99"}`.localeCompare(`${b.disp.iso} ${b.disp.time || "99:99"}`)
        )

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-4 mx-4 pb-28 md:pt-20">
            <Chip>
                <Chip.Label>Favoritos</Chip.Label>
            </Chip>

            {upcoming.length === 0 ? (
                <p className="text-muted mt-8 text-center text-sm">
                    Aún no tienes eventos guardados. Toca el corazón en un evento para guardarlo aquí.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                    {upcoming.map(({ event, disp }) => (
                        <EventCard
                            key={event._id ?? event.shortCode}
                            event={event}
                            time={disp.time}
                            dateLabel={shortDateLabel(disp.iso)}
                        />
                    ))}
                </div>
            )}

            <Navbar />
        </div>
    )
}
