import { useRecurringEvents } from "@/hooks/useRecurringEvents";
import { ScrollShadow } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { RecurringCard } from "./recurringCard";

export const RecurringSection = () => {
    const { posts, loading } = useRecurringEvents();
    const navigate = useNavigate();

    if (!loading && posts.length === 0) return null;

    return (
        <section className="w-full min-w-0">
            <div className="mx-auto mb-3 flex w-full max-w-xl items-center justify-between">
                <h2 className="text-h3">Recurrentes</h2>
                <button
                    className="text-sm font-semibold"
                    style={{ color: "var(--accent)" }}
                    onClick={() => navigate("/recurrentes")}
                >
                    Ver todos
                </button>
            </div>
            <ScrollShadow
                orientation="horizontal"
                className="-mx-4 snap-x snap-mandatory px-4 pb-2 sm:mx-0 sm:px-0"
            >
                <div className="flex gap-4">
                    {loading && <p>Cargando...</p>}
                    {posts.map((post) => (
                        <RecurringCard key={post._id} event={post} />
                    ))}
                </div>
            </ScrollShadow>
        </section>
    );
};
