import { Modal, ModalBody, ModalContent, Chip, User } from "@/compat/heroui";
import { CalendarIcon, MapPinIcon, MoneyIcon, XIcon } from "@/components/icons";
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
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            backdrop="blur"
            scrollBehavior="inside"
            size="lg"
        >
            <ModalContent>
                {(onClose) => (
                    <ModalBody className="p-0">
                        <div className="relative flex flex-col p-0">
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Cerrar"
                                className="absolute top-3 right-3 z-20 flex items-center justify-center size-9 rounded-full bg-black/60 text-white backdrop-blur-md shadow-lg hover:bg-black/80 transition"
                            >
                                <XIcon size={18} />
                            </button>
                            {images && images.length > 0 && (
                                <ImageCarousel images={[...images].flat()} />
                            )}

                            <div className="flex flex-col gap-3 px-0 py-4">
                                {title && (
                                    <h1 className="text-lg md:text-2xl font-semibold leading-tight tracking-tight">
                                        {title}
                                    </h1>
                                )}
                                {summary && (
                                    <p className="text-sm text-default-500 leading-snug">{summary}</p>
                                )}

                                {(nextDate || location || price) && (
                                    <div className="flex flex-col gap-1">
                                        {nextDate && (
                                            <div className="flex items-center gap-1.5">
                                                <CalendarIcon size={14} className="text-primary shrink-0" />
                                                <span className="text-sm font-medium capitalize">
                                                    {nextDate.label}
                                                </span>
                                                {parsedDates.length > 1 && (
                                                    <span className="text-xs text-default-500">
                                                        · {parsedDates.length} fechas
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPinIcon size={14} className="text-default-500 shrink-0" />
                                                <span className="text-sm text-default-600">{location}</span>
                                            </div>
                                        )}
                                        {price && (
                                            <div className="flex items-center gap-1.5">
                                                <MoneyIcon size={14} className="text-default-500 shrink-0" />
                                                <span className="text-sm text-default-600">{price}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {tags && tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {tags.map((t) => (
                                            <Chip
                                                key={t}
                                                variant="soft"
                                                color="accent"
                                                size="sm"
                                                className="rounded-lg h-5 text-tiny px-1.5"
                                            >
                                                #{t}
                                            </Chip>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-default-200/50 py-3 flex justify-center bg-content2/60">
                                <User
                                    name={owner?.fullName}
                                    description={"@" + ownerUsername}
                                    avatarProps={{ src: owner?.profilePicUrl }}
                                />
                            </div>
                        </div>
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    );
};
