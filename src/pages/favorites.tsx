import { Chip } from "@heroui/react"

import { EventCard } from "@/components/eventCard"
import { Navbar } from "@/components/navbar"
import { useLikedEvents } from "@/hooks/useLikedEvents"

export const Favorites = () => {
    const likedEvents = useLikedEvents()

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-4 mx-4 pb-28">
            <Chip>
                <Chip.Label>Favoritos</Chip.Label>
            </Chip>

            {likedEvents.length === 0 ? (
                <p className="text-muted mt-8 text-center text-sm">
                    Aún no tienes eventos guardados. Toca el corazón en un evento para guardarlo aquí.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {likedEvents.map((event) => (
                        <EventCard key={event._id ?? event.shortCode} event={event} />
                    ))}
                </div>
            )}

            <Navbar />
        </div>
    )
}
