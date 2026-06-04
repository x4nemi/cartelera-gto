import { PostData } from "@/types"
import { Card, Chip, Avatar, Button } from "@heroui/react"
import { useState } from "react";
import { EventModal } from "@/components/modal/eventModal";
import { Bookmark, BookmarkFill } from '@gravity-ui/icons';

export const Event = (props: PostData) => {
    const { images, title, tags, owner } = props;
    const [open, setOpen] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    return (
        <>
            <Card className="flex flex-row gap-3 p-2 cursor-pointer" onClick={() => setOpen(true)}>
                <img
                    alt={title}
                    className="rounded-2xl w-36 h-auto shrink-0 object-cover select-none"
                    loading="lazy"
                    src={images?.[0]}
                />
                <div className="flex flex-1 flex-col justify-between gap-1">
                    <div className="flex flex-col gap-1">
                        <Card.Title className="lg:text-lg text-lg line-clamp-2">{title}</Card.Title>

                        <div className="flex gap-1 flex-wrap">
                            {tags?.map((tag) => (
                                <Chip key={tag} className="text-[12px]">{tag}</Chip>
                            ))}
                        </div>
                    </div>
                    <Card.Footer className="flex">
                        <div className="w-full flex flex-row justify-between">
                            <div className="flex items-center gap-1">

                                <Avatar aria-label={`${owner?.username}'s profile picture`} className="size-8">
                                    <Avatar.Image
                                        alt={`${owner?.username}'s avatar`}
                                        src={owner?.profilePicUrl}
                                    />
                                    <Avatar.Fallback className="text-xs">{owner?.username?.[0]?.toUpperCase() ?? "?"}</Avatar.Fallback>
                                </Avatar>
                                <span className="text-xs">{owner?.fullName}</span>
                            </div>
                            <Button isIconOnly variant="outline" className="ml-auto" onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}>
                                {bookmarked ? <BookmarkFill /> : <Bookmark />}
                            </Button>
                        </div>
                    </Card.Footer>
                </div>
            </Card>

            <EventModal isOpen={open} onOpenChange={setOpen} event={props} />
        </>
    )
}
