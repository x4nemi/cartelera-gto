import { PostData } from "@/types"
import { Card, ToggleButton, Avatar } from "@heroui/react"
import { Heart, HeartFill } from "@gravity-ui/icons"
import { toggleLike, useIsLiked } from "@/hooks/useLikedEvents";

export const EventCard = ({ event }: { event: PostData }) => {
    const isLiked = useIsLiked(event);
    const { title, images, tags, owner } = event;
    return (
        <Card className="w-full flex-row" variant="tertiary">
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
                    <Card.Title className="pr-8">{title}</Card.Title>
                    <Card.Description className="flex flex-wrap gap-1 text-xs text-muted">
                        {
                            tags && tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-block text-xs font-medium"
                                >
                                    #{tag}
                                </span>
                            ))
                        }
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
                    <ToggleButton isIconOnly
                        isSelected={isLiked} onChange={() => toggleLike(event)}>
                        {({ isSelected: selected }) => (
                            selected ? <HeartFill /> : <Heart />
                        )}
                    </ToggleButton>
                </Card.Footer>
            </div>
        </Card>
    )
}
