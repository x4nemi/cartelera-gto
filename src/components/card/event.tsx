import { PostData } from "@/types"
import { Card, Chip, Avatar, Button } from "@heroui/react"
import { useState } from "react";
import { EventModal } from "@/components/modal/eventModal";
import { Bookmark, BookmarkFill, Calendar, Circles4Diamond, SquareHashtag, TagDollar } from '@gravity-ui/icons';


export const Event = (props: PostData) => {
    const { images, title, tags, owner, price, dates } = props;
    const [open, setOpen] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const isMultiDay = (dates?.length ?? 0) > 1;

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

                        <div className="flex flex-row gap-2">
                            <Circles4Diamond className="text-foreground/60 mt-1 shrink-0" height={16} width={16} />
                            <div className="flex flex-row flex-wrap gap-1">
                                {
                                    tags && tags.length > 0 ? (
                                        tags.map((tag) => (
                                            <Chip key={tag} size="md">
                                                {tag}
                                            </Chip>
                                        ))
                                    ) : (
                                        <span className="text-sm text-foreground/60">Sin categoría</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <TagDollar className="text-foreground/60 mt-1 shrink-0" height={16} width={16} />
                            <span className="text-sm text-foreground/60">
                                {price ? price : "Gratis"}
                            </span>
                        </div>
                    </div>
                    <Card.Footer className="flex">
                        <div className="w-full flex flex-row items-center justify-between gap-2">
                            <div className="flex items-center gap-1 min-w-0">
                                <Avatar aria-label={`${owner?.username}'s profile picture`} className="size-8">
                                    <Avatar.Image
                                        alt={`${owner?.username}'s avatar`}
                                        src={owner?.profilePicUrl}
                                    />
                                    <Avatar.Fallback className="text-xs">{owner?.username?.[0]?.toUpperCase() ?? "?"}</Avatar.Fallback>
                                </Avatar>
                                <span className="text-xs truncate">{owner?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button isIconOnly variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}>
                                    {bookmarked ? <BookmarkFill /> : <Bookmark />}
                                </Button>
                            </div>
                        </div>
                    </Card.Footer>
                </div>
            </Card>

            <EventModal isOpen={open} onOpenChange={setOpen} event={props} />
        </>
    )
}
