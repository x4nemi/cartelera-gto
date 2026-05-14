import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Chip,
    Tooltip,
    User,
    Link,
    ScrollShadow,
} from "@heroui/react";
import { ImageCarousel } from "../image/imageCarousel";
import { PostData } from "@/config/apiClient";
import { CalendarIcon, MapPinIcon, MoneyIcon } from "../icons";
import { useMemo } from "react";

export const EventDrawer = ({ isOpen, onOpenChange, cardProps }: { isOpen: boolean, onOpenChange: (open: boolean) => void, cardProps: PostData }) => {
    const { dates, images, ownerUsername, owner, title, summary, location, price, tags, url } = cardProps;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parsedDates = useMemo(() => {
        if (!dates) return [];
        return dates
            .map((raw) => {
                const [y, m, d] = raw.split("-").map(Number);
                const dateObj = new Date(y, m - 1, d);
                return {
                    raw,
                    dateObj,
                    label: dateObj.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                    short: dateObj.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }),
                    isPast: dateObj < today,
                };
            })
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dates]);

    const nextDate = parsedDates.find((d) => !d.isPast) ?? parsedDates[parsedDates.length - 1];
    const hasMultipleDates = parsedDates.length > 1;

    return (
        <Drawer
            hideCloseButton
            backdrop="blur"
            classNames={{
                base: "sm:data-[placement=right]:m-4 xs:data-[placement=right]:m-10 sm:data-[placement=left]:m-2 rounded-medium",
            }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 border-b border-default-200/50 justify-between bg-content1/70 backdrop-saturate-150 backdrop-blur-lg">
                            <Tooltip content="Cerrar">
                                <Button
                                    isIconOnly
                                    className="text-default-500"
                                    size="sm"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    <svg
                                        fill="none"
                                        height="20"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
                                    </svg>
                                </Button>
                            </Tooltip>
                            {url && (
                                <Button
                                    className="font-medium text-small text-default-600"
                                    endContent={
                                        <svg
                                            fill="none"
                                            height="14"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="14"
                                        >
                                            <path d="M7 17 17 7M7 7h10v10" />
                                        </svg>
                                    }
                                    size="sm"
                                    variant="flat"
                                    as={Link}
                                    href={url}
                                    target="_blank"
                                >
                                    Página del evento
                                </Button>
                            )}
                        </DrawerHeader>

                        <DrawerBody className="pt-16 px-4 sm:px-6 gap-5">
                            {/* Image */}
                            {images && images.length > 0 && (
                                <div className="flex w-full justify-center items-center pt-2">
                                    <div className="w-full rounded-2xl overflow-hidden bg-content2">
                                        <ImageCarousel images={[...(images ?? [])].flat()} />
                                    </div>
                                </div>
                            )}

                            {/* Title + summary */}
                            {(title || summary) && (
                                <div className="flex flex-col gap-1.5">
                                    {title && (
                                        <h2 className="text-2xl font-semibold leading-tight tracking-tight">
                                            {title}
                                        </h2>
                                    )}
                                    {summary && (
                                        <p className="text-medium text-default-500 leading-snug">{summary}</p>
                                    )}
                                </div>
                            )}

                            {/* Quick facts: next date, location, price */}
                            {(nextDate || location || price) && (
                                <div className="flex flex-col gap-2 rounded-2xl bg-content2/60 border border-default-200/60 p-3">
                                    {nextDate && (
                                        <div className="flex items-start gap-2">
                                            <CalendarIcon className="text-primary shrink-0 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-small font-medium text-foreground capitalize">
                                                    {nextDate.short}
                                                </span>
                                                {hasMultipleDates && (
                                                    <span className="text-tiny text-default-500">
                                                        {parsedDates.length} fechas en total
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-start gap-2">
                                            <MapPinIcon size={18} className="text-default-500 shrink-0 mt-0.5" />
                                            <span className="text-small text-foreground">{location}</span>
                                        </div>
                                    )}
                                    {price && (
                                        <div className="flex items-start gap-2">
                                            <MoneyIcon size={18} className="text-default-500 shrink-0 mt-0.5" />
                                            <span className="text-small text-foreground">{price}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tags */}
                            {tags && tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {tags.map((t) => (
                                        <Chip key={t} variant="flat" color="primary" size="sm" className="rounded-xl">
                                            #{t}
                                        </Chip>
                                    ))}
                                </div>
                            )}

                            {/* All dates list (only if more than one) */}
                            {hasMultipleDates && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-small font-medium text-default-700">
                                        Todas las fechas
                                    </span>
                                    <ScrollShadow hideScrollBar className="w-full max-h-[140px] flex flex-col gap-1">
                                        {parsedDates.map((d) => {
                                            const isNext = d === nextDate;
                                            return (
                                                <p
                                                    key={d.raw}
                                                    className={`text-small capitalize ${
                                                        d.isPast
                                                            ? "text-default-400 line-through"
                                                            : isNext
                                                                ? "text-primary font-medium"
                                                                : "text-default-600"
                                                    }`}
                                                >
                                                    <CalendarIcon className="inline mr-1.5" /> {d.label}
                                                </p>
                                            );
                                        })}
                                    </ScrollShadow>
                                </div>
                            )}
                        </DrawerBody>

                        <DrawerFooter className="flex flex-col gap-1 border-t border-default-200/50 bg-content2">
                            <Link
                                href={`https://instagram.com/${ownerUsername}`}
                                target="_blank"
                                className="text-foreground"
                            >
                                <User
                                    name={owner?.fullName}
                                    description={"@" + ownerUsername}
                                    avatarProps={{ src: owner?.profilePicUrl }}
                                />
                            </Link>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
