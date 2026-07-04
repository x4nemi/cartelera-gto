import { useRecurringEvents } from "@/hooks/useRecurringEvents";
import { RecurringCard } from "./recurringCard";

export const RecurringSection = () => {
    const { posts, loading } = useRecurringEvents();

    if (!loading && posts.length === 0) return null;

    return (
        <section className="w-full min-w-0">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-h3">Recurrentes</h2>
                <button
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent)" }}
                >
                    Ver todos
                </button>
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                {loading && <p>Cargando...</p>}
                {posts.map((post) => (
                    <RecurringCard key={post._id} event={post} />
                ))}
            </div>
        </section>
    );
};
