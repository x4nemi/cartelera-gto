import { PostData } from "@/config/apiClient";
import { Card, Avatar, Chip } from "@heroui/react";
import { ArrowsRotateLeft, Calendar } from "@gravity-ui/icons";
import { getOngoingLabel } from "@/utils/recurrence";
import { useState } from "react";
import { EventModal } from "./eventModal";

/** Compact, image-less recurring-event card (label + title + next date) for the home row. */
export const MiniRecurringCard = ({ event, nextLabel }: { event: PostData; nextLabel?: string | null }) => {
    const { title, owner, dates, endsOn } = event;
    const [isOpen, setIsOpen] = useState(false);
    const ongoing = getOngoingLabel(dates, endsOn);
    const label = ongoing?.text ?? "Recurrente";
    const Icon = ongoing?.kind === "until" ? Calendar : ArrowsRotateLeft;

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
            <Card.Header className="gap-2">
                <Chip
                    variant="soft"
                    color="accent"
                    className="font-semibold text-indigo-500 bg-indigo-600/10 inline-flex items-center gap-1.5 px-2 py-1 w-fit"
                >
                    <Icon className="size-4" />
                    <Chip.Label className="font-semibold">{label}</Chip.Label>
                </Chip>
                <Card.Title className="pr-2">{title}</Card.Title>
                {nextLabel && (
                    <Card.Description className="text-sm text-muted">Próxima: {nextLabel}</Card.Description>
                )}
            </Card.Header>
            <Card.Footer className="mt-auto flex items-center gap-2">
                <Avatar className="size-7">
                    <Avatar.Image
                        alt={owner?.fullName || owner?.username || "User"}
                        src={owner?.profilePicUrl}
                    />
                    <Avatar.Fallback>XL</Avatar.Fallback>
                </Avatar>
                <span className="text-sm font-medium">{owner?.fullName || owner?.username}</span>
            </Card.Footer>
            <EventModal event={event} isOpen={isOpen} onOpenChange={setIsOpen} />
        </Card>
    );
};
