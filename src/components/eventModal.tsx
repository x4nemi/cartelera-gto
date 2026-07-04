import { PostData } from "@/config/apiClient";
import { Modal, Button, Avatar, ToggleButton } from "@heroui/react";
import { ArrowsRotateLeft, Calendar, MapPin, Wallet, Heart, HeartFill } from "@gravity-ui/icons";
import { getOngoingLabel, parseLocalDate } from "@/utils/recurrence";
import { toggleLike, useIsLiked } from "@/hooks/useLikedEvents";

const formatFullDate = (iso: string) =>
    parseLocalDate(iso).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const getDateText = (event: PostData): { text: string; recurring: boolean } | null => {
    const ongoing = getOngoingLabel(event.dates, event.endsOn);
    if (ongoing) return { text: ongoing.text, recurring: ongoing.kind !== "until" };

    if (event.dates && event.dates.length > 0) {
        const sorted = [...event.dates].sort();
        const text =
            sorted.length === 1
                ? formatFullDate(sorted[0])
                : `Del ${formatFullDate(sorted[0])} al ${formatFullDate(sorted[sorted.length - 1])}`;
        return { text, recurring: false };
    }

    return null;
};

interface EventModalProps {
    event: PostData;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EventModal = ({ event, isOpen, onOpenChange }: EventModalProps) => {
    const { title, images, tags, location, price, owner, url, caption } = event;
    const isLiked = useIsLiked(event);
    const dateInfo = getDateText(event);
    const DateIcon = dateInfo?.recurring ? ArrowsRotateLeft : Calendar;

    return (
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
            <Modal.Container placement="auto">
                <Modal.Dialog className="sm:w-full">
                    <Modal.Body className="flex flex-col gap-4 p-0">
                        <img
                            alt={title}
                            className="h-auto w-full rounded-t-2xl"
                            src={images[0]}
                        />
                        <div className="flex flex-col gap-4 px-4 pb-2">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-h3">{title}</h2>
                                    {dateInfo && (
                                        <span className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted">
                                            <DateIcon className="size-4" />
                                            {dateInfo.text}
                                        </span>
                                    )}
                                </div>
                                <ToggleButton
                                    isIconOnly
                                    aria-label="Me gusta"
                                    isSelected={isLiked}
                                    onChange={() => toggleLike(event)}
                                >
                                    {({ isSelected: selected }) =>
                                        selected ? <HeartFill /> : <Heart />
                                    }
                                </ToggleButton>
                            </div>

                            {caption && (
                                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                                    {caption}
                                </p>
                            )}

                            <div className="flex flex-col gap-2">
                                {location && (
                                    <span className="flex items-start gap-2 text-sm text-muted">
                                        <MapPin className="mt-0.5 size-4 shrink-0" />
                                        {location}
                                    </span>
                                )}
                                {price && (
                                    <span className="flex items-center gap-2 text-sm text-muted">
                                        <Wallet className="size-4 shrink-0" />
                                        {price}
                                    </span>
                                )}
                            </div>

                            {tags && tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-default-100 px-2 py-0.5 text-xs font-medium text-muted"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <Avatar className="size-8">
                                    <Avatar.Image
                                        alt={owner?.fullName || owner?.username || "User"}
                                        src={owner?.profilePicUrl}
                                    />
                                    <Avatar.Fallback>XL</Avatar.Fallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                    {owner?.fullName || owner?.username}
                                </span>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button slot="close" variant="secondary">
                            Cerrar
                        </Button>
                        {url && (
                            <Button onPress={() => window.open(url, "_blank", "noopener,noreferrer")}>
                                Ver en Instagram
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
};
