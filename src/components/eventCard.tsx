import { PostData } from "@/types"
import { Card, ToggleButton, Avatar, Separator } from "@heroui/react"
import { Heart, HeartFill } from "@gravity-ui/icons"
import { toggleLike, useIsLiked } from "@/hooks/useLikedEvents";
import { highlightMatch } from "@/utils/highlight";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventModal } from "./eventModal";

export const EventCard = ({ event, time, highlighted, highlight }: { event: PostData; time?: string | null; highlighted?: boolean; highlight?: string }) => {
    const isLiked = useIsLiked(event);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { title, images, tags, owner, price } = event;
    return (
        <Card
            className="w-full flex-col cursor-pointer transition-[outline] duration-300"
            variant="tertiary"
            role="button"
            tabIndex={0}
            style={{
                outline: highlighted ? "2px solid var(--accent)" : "2px solid transparent",
                outlineOffset: "2px",
            }}
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsOpen(true);
                }
            }}
        >
            <div className="relative -mx-4 -mt-4 h-48 overflow-hidden rounded-t-[min(32px,var(--radius-3xl))]">
                <img
                    alt={title}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
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
                {price && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white line-clamp-1">
                        {price}
                    </span>
                )}
            </div>

            <Card.Header className="gap-1">
                <Card.Title className="line-clamp-1">{highlightMatch(title, highlight)}</Card.Title>
                <Card.Description className="flex flex-wrap gap-1.5 text-sm text-muted">
                    {tags && tags.map((tag) => (
                        <span key={tag} className="font-medium">
                            #{highlightMatch(tag, highlight)}
                        </span>
                    ))}
                </Card.Description>
            </Card.Header>
            {/* <Separator variant="tertiary" /> */}
            <Card.Footer className="flex items-center justify-between gap-2 ">
                <div
                    className={owner?.username ? "flex items-center gap-2 cursor-pointer bg-border hover:bg-border-secondary transition duration-300 py-2 px-2 rounded-xl" : "flex items-center gap-2"}
                    role={owner?.username ? "button" : undefined}
                    tabIndex={owner?.username ? 0 : undefined}
                    onClick={(e) => {
                        if (!owner?.username) return;
                        e.stopPropagation();
                        navigate(`/eventos/${owner.username}`);
                    }}
                    onKeyDown={(e) => {
                        if (!owner?.username) return;
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/eventos/${owner.username}`);
                        }
                    }}
                >
                    <Avatar className="size-8">
                        <Avatar.Image
                            alt={owner?.fullName || owner?.username || "User"}
                            src={owner?.profilePicUrl}
                        />
                        <Avatar.Fallback>XL</Avatar.Fallback>
                    </Avatar>
                    <span className="text-sm font-medium">{highlightMatch(owner?.fullName || owner?.username, highlight)}</span>
                </div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    role="presentation"
                >
                    <ToggleButton isIconOnly size="lg"
                        isSelected={isLiked} onChange={() => toggleLike(event)}>
                        {({ isSelected: selected }) => (
                            selected ? <HeartFill className="size-6" /> : <Heart className="size-6" />
                        )}
                    </ToggleButton>
                </div>
            </Card.Footer>
            <EventModal event={event} isOpen={isOpen} onOpenChange={setIsOpen} />
        </Card>
    )
}
