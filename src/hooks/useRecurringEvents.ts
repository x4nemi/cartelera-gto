import { CosmosAPI, PostData } from "@/config/apiClient";
import { isOngoing } from "@/utils/recurrence";
import { useEffect, useRef, useState } from "react";

const LIMIT = 100;

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
                // Fetch EVERY page: the API paginates and sorts by createdAt, so a
                // single page can leave older recurring events out of the list.
                const all: PostData[] = [];
                let page = 1;
                for (let guard = 0; guard < 20; guard++) {
                    const response = await CosmosAPI.getEvents({ page, limit: LIMIT, upcoming: true });
                    all.push(...response.data);
                    if (!response.pagination?.hasNextPage) break;
                    page++;
                }
                setPosts(all.filter((post) => isOngoing(post.dates, post.endsOn)));
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
