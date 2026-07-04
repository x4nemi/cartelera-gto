import { useEvents } from "@/hooks/useEvents";
import { parseLocalDate } from "@/utils/recurrence";
import { PostData } from "@/types";
import { EventCard } from "./eventCard";

const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Pick the display date/time for a post: earliest upcoming, else earliest. */
const getDisplay = (post: PostData) => {
    const dates = [...(post.dates ?? [])].sort();
    if (dates.length === 0) return null;
    const todayIso = toIso(new Date());
    const pick = dates.find((d) => d.slice(0, 10) >= todayIso) ?? dates[0];
    const date = parseLocalDate(pick);
    if (Number.isNaN(date.getTime())) return null;
    const time = pick.length >= 16 && pick[10] === "T" ? pick.slice(11, 16) : null;
    return { iso: pick.slice(0, 10), date, time };
};

export const EventList = () => {
    const { posts, loading, loadingMore, hasMore, loadMore } = useEvents();

    // Group posts by day.
    const groupsMap = new Map<
        string,
        { date: Date; items: { post: PostData; time: string | null }[] }
    >();
    posts.forEach((post) => {
        const disp = getDisplay(post);
        if (!disp) return;
        if (!groupsMap.has(disp.iso)) groupsMap.set(disp.iso, { date: disp.date, items: [] });
        groupsMap.get(disp.iso)!.items.push({ post, time: disp.time });
    });
    const groups = [...groupsMap.entries()]
        .map(([iso, g]) => ({ iso, ...g }))
        .sort((a, b) => (a.iso < b.iso ? -1 : 1));
    groups.forEach((g) =>
        g.items.sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"))
    );

    const todayIso = toIso(new Date());

    return (
        <div className="flex flex-col gap-6">
            {loading && <p>Cargando...</p>}
            {!loading && groups.length > 0 && <h2 className="text-h3">Agenda</h2>}

            {groups.map((group) => {
                const isToday = group.iso === todayIso;
                const day = group.date.getDate();
                const weekdayFull = group.date.toLocaleDateString("es-MX", { weekday: "long" });
                const weekdayShort = capitalize(
                    group.date.toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "")
                );
                const monthFull = group.date.toLocaleDateString("es-MX", { month: "long" });
                const count = group.items.length;
                return (
                    <div key={group.iso} className="flex flex-col gap-3">
                        <div className="flex items-baseline justify-between gap-2">
                            <h3 className="text-lg font-bold">
                                {isToday ? (
                                    <>
                                        <span style={{ color: "var(--accent)" }}>Hoy</span>{" "}
                                        <span className="text-base font-normal text-muted">
                                            {weekdayFull} {day} de {monthFull}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        {weekdayShort} {day}{" "}
                                        <span className="text-base font-normal text-muted">
                                            {monthFull}
                                        </span>
                                    </>
                                )}
                            </h3>
                            <span className="shrink-0 text-sm text-muted">
                                {count} {count === 1 ? "evento" : "eventos"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-4">
                            {group.items.map(({ post, time }) => (
                                <EventCard key={post._id} event={post} time={time} />
                            ))}
                        </div>
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
