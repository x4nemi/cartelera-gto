import { Modal, Chip, Avatar, Typography } from "@heroui/react";
import { CalendarIcon, MapPinIcon, MoneyIcon } from "@/components/icons";
import { ImageCarousel } from "@/components/image/imageCarousel";
import type { PostData } from "@/types";
import { useMemo } from "react";

interface EventModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: PostData;
}

export const EventModal = ({ isOpen, onOpenChange, event }: EventModalProps) => {
    const { images, title, summary, location, price, tags, owner, ownerUsername } = event;

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const parsedDates = useMemo(() => {
        if (!event.dates) return [];
        return event.dates
            .map((raw) => {
                const d = new Date(raw);
                if (isNaN(d.getTime())) return null;
                return {
                    raw,
                    dateObj: d,
                    label: d.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    }),
                    isPast: d < today,
                };
            })
            .filter((d): d is NonNullable<typeof d> => d !== null)
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    }, [event.dates, today]);

    const nextDate = parsedDates.find((d) => !d.isPast) ?? parsedDates[parsedDates.length - 1];

    return (
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
            <Modal.Container placement="center" size="lg" scroll="inside">
                <Modal.Dialog className="lg:max-w-4xl p-2">
                    <Modal.CloseTrigger />
                    <Modal.Body className="p-0">
                        <div className="flex flex-col lg:flex-row">
                            {images && images.length > 0 && (
                                <div className="lg:w-3/5 rounded-lg overflow-hidden lg:shrink-0 bg-default/40">
                                    <ImageCarousel images={[...images].flat()} />
                                </div>
                            )}

                            <div className="flex flex-1 flex-col lg:min-w-0">
                                <div className="flex flex-col gap-3 p-2 lg:p-5">
                                    {title && (
                                        <Typography type="h4" className="pr-10">
                                            {title}
                                        </Typography>
                                    )}
                                    {summary && (
                                        <Typography type="body-sm" className="text-muted">
                                            {summary}
                                        </Typography>
                                    )}

                                    {(nextDate || location || price) && (
                                        <div className="flex flex-col gap-1.5">
                                            {nextDate && (
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon size={16} className="text-accent shrink-0" />
                                                    <span className="text-sm font-medium capitalize">
                                                        {nextDate.label}
                                                    </span>
                                                    {parsedDates.length > 1 && (
                                                        <span className="text-xs text-muted">
                                                            · {parsedDates.length} fechas
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon size={16} className="text-muted shrink-0" />
                                                    <span className="text-sm">{location}</span>
                                                </div>
                                            )}
                                            {price && (
                                                <div className="flex items-center gap-2">
                                                    <MoneyIcon size={16} className="text-muted shrink-0" />
                                                    <span className="text-sm">{price}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {tags && tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.map((t) => (
                                                <Chip key={t} variant="soft" color="accent" size="sm">
                                                    <Chip.Label>#{t}</Chip.Label>
                                                </Chip>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto flex items-center justify-center gap-3 border-t border-default px-5 py-3">
                                    <Avatar
                                        size="sm"
                                        aria-label={`${ownerUsername}'s profile picture`}
                                    >
                                        <Avatar.Image
                                            alt={`${ownerUsername}'s avatar`}
                                            src={owner?.profilePicUrl}
                                        />
                                        <Avatar.Fallback>
                                            {ownerUsername?.[0]?.toUpperCase() ?? "?"}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{owner?.fullName}</span>
                                        <span className="text-xs text-muted">@{ownerUsername}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
};
