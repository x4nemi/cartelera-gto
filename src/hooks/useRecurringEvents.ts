import { CosmosAPI, PostData } from "@/config/apiClient";
import { isOngoing } from "@/utils/recurrence";
import { useEffect, useRef, useState } from "react";

const LIMIT = 50;

export function useRecurringEvents() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const load = async () => {
            setLoading(true);
            try {
                const response = await CosmosAPI.getEvents({ limit: LIMIT, upcoming: true });
                setPosts(response.data.filter((post) => isOngoing(post.dates, post.endsOn)));
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Failed to fetch recurring events:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return { posts, loading };
}
