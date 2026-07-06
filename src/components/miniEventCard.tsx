import { PostData } from "@/types";
import { Card } from "@heroui/react";
import { useState } from "react";
import { EventModal } from "./eventModal";

/** Compact event card (image + time + title + "venue · price") for the home rows. */
export const MiniEventCard = ({ event, time }: { event: PostData; time?: string | null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { title, images, location, owner, price } = event;
    const venue = location || owner?.fullName || owner?.username;
    const subtitle = [venue, price || "Gratis"].filter(Boolean).join(" · ");

    return (
        <Card
            className="w-56 shrink-0 snap-start cursor-pointer md:w-64"
            variant="tertiary"
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsOpen(true);
                }
            }}
        >
            <div className="relative h-32 w-full overflow-hidden rounded-2xl md:h-36">
                <img
                    alt={title}
                    className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                    loading="lazy"
                    src={images[0]}
                />
                {time && (
                    <span
                        className="absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-bold"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
                    >
                        {time}
                    </span>
                )}
            </div>
            <Card.Header className="gap-0.5">
                <Card.Title className="pr-2 text-base">{title}</Card.Title>
                <Card.Description className="text-sm text-muted">{subtitle}</Card.Description>
            </Card.Header>
            <EventModal event={event} isOpen={isOpen} onOpenChange={setIsOpen} />
        </Card>
    );
};
