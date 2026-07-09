import { Card, Skeleton } from "@heroui/react";

/** Loading placeholder shaped like an EventCard (image + title + tags + owner). */
export const EventCardSkeleton = () => (
    <Card className="w-full" variant="tertiary">
        <div className="-mx-4 -mt-4 overflow-hidden rounded-t-[min(32px,var(--radius-3xl))]">
            <Skeleton className="h-48 w-full" />
        </div>
        <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-3 w-2/5 rounded" />
        </div>
        <div className="flex items-center gap-2">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="h-3 w-28 rounded" />
        </div>
    </Card>
);
