import { CardHeader } from "@/compat/heroui";
import { Chip } from "@/compat/heroui";
import { Avatar, Card, Image } from "@/compat/heroui";

import { CalendarIcon } from '@/components/icons';
import { PostData } from '@/types';
import { EventDrawer } from './eventDrawer';
import { useState } from 'react';


export const XimenasCard = (props: PostData & { displayDate?: Date }) => {
    const { title, tags, images, dates, displayDate } = props;

    const parseLocalDate = (s: string) => {
        const [y, m, d] = s.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parsedDates = (dates || [])
        .map(d => parseLocalDate(d))
        .sort((a, b) => a.getTime() - b.getTime());
    const nextDate = parsedDates.find(d => d.getTime() >= today.getTime());
    const dateToShow = displayDate ?? nextDate ?? parsedDates[0];
    const formatSpanishDate = (d: Date) => {
        const weekday = d.toLocaleDateString('es-ES', { weekday: 'long' });
        const day = d.getDate();
        const month = d.toLocaleDateString('es-ES', { month: 'long' });
        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
        return `${cap(weekday)}, ${day} de ${month}`;
    };
    const dateStr = dateToShow ? formatSpanishDate(dateToShow) : 'Fecha por confirmar';

    const visibleTags = (tags || []).slice(0, 4);
    const extraTags = (tags || []).length - visibleTags.length;

    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <Card
            shadow="sm"
            className="w-full bg-content2 rounded-4xl overflow-hidden flex-row p-2 gap-2"
            isPressable
            onPress={() => setIsOpen(true)}
        >
            <CardHeader className="flex-4/6 rounded-3xl m-0 p-0 overflow-hidden">
                <Image
                    alt={title}
                    className="w-full h-full object-cover rounded-3xl"
                    src={images?.[0]}
                />
            </CardHeader>

            <CardHeader className="flex-2/6 min-w-0 flex flex-col items-start justify-between gap-3 p-1">
                <div className="flex flex-col gap-2 w-full min-w-0">
                    <h3 className="text-start text-lg md:text-xl font-semibold leading-tight tracking-tight line-clamp-4 break-words">
                        {title}
                    </h3>

                    {visibleTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {visibleTags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    size="sm"
                                    color="accent"
                                    variant="soft"
                                    className="rounded-full text-[11px] max-w-full"
                                    classNames={{ content: "truncate" }}
                                >
                                    {tag}
                                </Chip>
                            ))}
                            {extraTags > 0 && (
                                <Chip
                                    size="sm"
                                    variant="soft"
                                    className="rounded-full text-[11px]"
                                >
                                    +{extraTags}
                                </Chip>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full min-w-0 text-default-600">
                    <div className="z-20 flex items-center gap-1.5 max-w-[90%]">
                        <Avatar
                            src={props.owner?.profilePicUrl}
                            size="sm"
                            className="w-5 h-5 shrink-0"
                        />
                        <span className="text-xs">
                            {props.owner?.fullName ?? `@${props.ownerUsername}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-start">
                        <CalendarIcon size={20} className=" text-default-500" />
                        <span className="">{dateStr}</span>
                    </div>
                </div>
            </CardHeader>
        </Card>
         <EventDrawer isOpen={isOpen} onOpenChange={setIsOpen} cardProps={props} />
        </>
    );
};
