import { PostData } from "@/types"
import { Card, ToggleButton, Avatar } from "@heroui/react"
import { Heart, HeartFill } from "@gravity-ui/icons"
import { useState } from "react";

export const EventCard = ({ event }: { event: PostData }) => {
    const [isLiked, setIsLiked] = useState(false);
    const { title, images, tags, owner } = event;
    return (
        <Card className="w-full items-stretch md:flex-row" variant="secondary">
            <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
                <img
                    alt="Cherries"
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
                <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                        isSelected={isLiked} onChange={setIsLiked}>
                        {({ isSelected: selected }) => (
                            selected ? <HeartFill /> : <Heart />
                        )}
                    </ToggleButton>
                </Card.Footer>
            </div>
        </Card>
    )
}
