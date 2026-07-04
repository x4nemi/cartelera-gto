import { PostData } from "@/config/apiClient";
import { Card, Avatar } from "@heroui/react";
import { ArrowsRotateLeft, Calendar } from "@gravity-ui/icons";
import { getOngoingLabel } from "@/utils/recurrence";
import { useState } from "react";
import { EventModal } from "./eventModal";

export const RecurringCard = ({ event }: { event: PostData }) => {
    const { title, images, owner, dates, endsOn } = event;
    const [isOpen, setIsOpen] = useState(false);
    const ongoing = getOngoingLabel(dates, endsOn);
    const label = ongoing?.text ?? "Recurrente";
    const Icon = ongoing?.kind === "until" ? Calendar : ArrowsRotateLeft;

    return (
        <Card
            className="w-56 shrink-0 snap-start md:w-64 cursor-pointer"
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
            <div className="relative h-32 w-full overflow-hidden rounded-2xl md:h-40">
                <img
                    alt={title}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
                    loading="lazy"
                    src={images[0]}
                />
            </div>
            <Card.Header className="gap-2">
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                    <Icon className="size-3" />
                    {label}
                </span>
                <Card.Title className="pr-2">{title}</Card.Title>
            </Card.Header>
            <Card.Footer className="flex items-center gap-2 mt-auto">
                <Avatar className="size-7">
                    <Avatar.Image
                        alt={owner?.fullName || owner?.username || "User"}
                        src={owner?.profilePicUrl}
                    />
                    <Avatar.Fallback>XL</Avatar.Fallback>
                </Avatar>
                <span className="text-sm font-medium">
                    {owner?.fullName || owner?.username}
                </span>
            </Card.Footer>
            <EventModal event={event} isOpen={isOpen} onOpenChange={setIsOpen} />
        </Card>
    );
};
