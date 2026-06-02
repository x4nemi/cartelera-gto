import { PostData } from "@/types"
import { Card, Chip, Avatar } from "@heroui/react"
import { useState } from "react";
import { motion } from "motion/react";
import { EventModal } from "@/components/modal/eventModal";

export const Event = (props: PostData) => {
    const { images, title, tags, owner, shortCode } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card className="flex flex-row gap-3 p-2 cursor-pointer" onClick={() => setOpen(true)}>
                <motion.img
                    layoutId={`event-image-${shortCode}`}
                    alt={title}
                    className="rounded-2xl w-28 h-28 shrink-0 object-cover select-none"
                    loading="lazy"
                    src={images?.[0]}
                />
                <div className="flex flex-1 flex-col justify-between gap-1">
                    <Card.Title className="text-xs/4 line-clamp-2">{title}</Card.Title>
                    <div className="flex gap-1 flex-wrap">
                        {tags?.map((tag) => (
                            <Chip key={tag} className="text-[10px]">{tag}</Chip>
                        ))}
                    </div>
                    <Card.Footer className="flex gap-2">
                        <Avatar aria-label={`${owner?.username}'s profile picture`} className="size-5">
                            <Avatar.Image
                                alt={`${owner?.username}'s avatar`}
                                src={owner?.profilePicUrl}
                            />
                            <Avatar.Fallback className="text-xs">IH</Avatar.Fallback>
                        </Avatar>
                        <span className="text-xs">{owner?.fullName}</span>
                    </Card.Footer>
                </div>
            </Card>

            <EventModal isOpen={open} onOpenChange={setOpen} event={props} />
        </>
    )
}
