import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "./eventCard";

export const EventList = () => {
    const { posts, loading, loadingMore, hasMore, loadMore } = useEvents();
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading && <p>Cargando...</p>}
            {posts.map((post) => (
                <EventCard key={post._id} event={post} />
            ))}
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
