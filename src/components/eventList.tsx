import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "./eventCard";

const getEventTime = (dates: string[] | null) => {
    if (!dates || dates.length === 0) return Number.POSITIVE_INFINITY;
    const time = new Date(dates[0]).getTime();
    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

const getDateKey = (dates: string[] | null) => {
    if (!dates || dates.length === 0) return null;
    const date = new Date(dates[0]);
    if (Number.isNaN(date.getTime())) return null;
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatEventDate = (dates: string[] | null) => {
    if (!dates || dates.length === 0) return null;
    const date = new Date(dates[0]);
    if (Number.isNaN(date.getTime())) return null;
    const day = date.getDate();
    const month = date
        .toLocaleDateString("es-MX", { month: "short" })
        .replace(".", "");
    return { day, month };
};

export const EventList = () => {
    const { posts, loading, loadingMore, hasMore, loadMore } = useEvents();
    const sortedPosts = [...posts].sort(
        (a, b) => getEventTime(a.dates) - getEventTime(b.dates)
    );
    const dateKeys = sortedPosts.map((post) => getDateKey(post.dates));
    // Show the badge only on the first event of each distinct date.
    const showsBadge = dateKeys.map(
        (key, i) => key !== null && (i === 0 || key !== dateKeys[i - 1])
    );
    const lastBadgeIndex = showsBadge.lastIndexOf(true);
    return (
        <div className="flex flex-col gap-4">
            {loading && <p>Cargando...</p>}
            {!loading && sortedPosts.length === 0 && (
                <h2 className="text-h3">Agenda</h2>
            )}
            {sortedPosts.map((post, index) => {
                const eventDate = formatEventDate(post.dates);
                const showBadge = showsBadge[index];
                const isFirstBadge = index === 0 && showBadge;
                const lineClass = index > lastBadgeIndex
                    ? "hidden"
                    : index === 0 && index === lastBadgeIndex
                        ? "hidden"
                        : index === 0
                            ? "top-7 bottom-0"
                            : index === lastBadgeIndex
                                ? "top-0 h-7"
                                : "inset-y-0";
                return (
                    <div key={post._id} className="flex gap-3">
                        <div className="relative flex w-14 shrink-0 justify-center">
                            <div className={`absolute w-px bg-default-200 ${lineClass}`} />
                            {eventDate && showBadge && (
                                <div
                                    className={`z-10 flex size-14 flex-col items-center justify-center rounded-full ${isFirstBadge ? "" : "bg-default-100"}`}
                                    style={
                                        isFirstBadge
                                            ? { backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }
                                            : undefined
                                    }
                                >
                                    <span className="text-lg font-bold leading-none">
                                        {eventDate.day}
                                    </span>
                                    <span className={isFirstBadge ? "text-xs" : "text-xs text-muted"}>
                                        {eventDate.month}
                                    </span>
                                </div>
                            )}
                        </div>
                        <EventCard event={post} />
                    </div>
                );
            })}
            {hasMore && !loading && (
                <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {loadingMore ? "Loading..." : "Load More"}
                </button>
            )}
        </div>
    )
}
