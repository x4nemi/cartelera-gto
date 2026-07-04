import { PostData } from "@/types"
import { Card, ToggleButton, Avatar } from "@heroui/react"
import { Heart, HeartFill } from "@gravity-ui/icons"
import { toggleLike, useIsLiked } from "@/hooks/useLikedEvents";
import { useState } from "react";
import { EventModal } from "./eventModal";

export const EventCard = ({ event, time }: { event: PostData; time?: string | null }) => {
    const isLiked = useIsLiked(event);
    const [isOpen, setIsOpen] = useState(false);
    const { title, images, tags, owner, price } = event;
    return (
        <Card
            className="w-full flex-row cursor-pointer"
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
            <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-2xl ">
                <img
                    alt={title}
                    className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
                    loading="lazy"
                    src={images[0]}
                />
            </div>
            <div className="flex flex-1 flex-col gap-3">
                <Card.Header className="gap-1">
                    <div className="flex items-start justify-between gap-2">
                        <Card.Title>{title}</Card.Title>
                        {time && (
                            <span
                                className="shrink-0 text-sm font-semibold"
                                style={{ color: "var(--accent)" }}
                            >
                                {time}
                            </span>
                        )}
                    </div>
                    <Card.Description className="flex flex-wrap items-center gap-1 text-xs text-muted">
                        {tags && tags.map((tag) => (
                            <span key={tag} className="inline-block text-xs font-medium">
                                #{tag}
                            </span>
                        ))}
                        {price && <span>· {price}</span>}
                    </Card.Description>
                </Card.Header>
                <Card.Footer className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                            <Avatar.Image
                                alt={owner?.fullName || owner?.username || "User"}
                                src={owner?.profilePicUrl}
                            />
                            <Avatar.Fallback>XL</Avatar.Fallback>
                        </Avatar>
                        <span className="text-sm font-medium">{owner?.fullName || owner?.username}</span>
                    </div>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        role="presentation"
                    >
                        <ToggleButton isIconOnly
                            isSelected={isLiked} onChange={() => toggleLike(event)}>
                            {({ isSelected: selected }) => (
                                selected ? <HeartFill /> : <Heart />
                            )}
                        </ToggleButton>
                    </div>
                </Card.Footer>
            </div>
            <EventModal event={event} isOpen={isOpen} onOpenChange={setIsOpen} />
        </Card>
    )
}
