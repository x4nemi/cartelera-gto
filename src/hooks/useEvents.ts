import { CosmosAPI, PostData } from "@/config/apiClient";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 20;

export function useEvents() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageRef = useRef(1);
    const fetchedRef = useRef(false);

    const fetchPage = useCallback(async (page: number, append: boolean) => {
        try {
            const response = await CosmosAPI.getEvents({ page, limit: PAGE_SIZE });
            const newPosts = response.data;

            setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
            setHasMore(response.pagination.hasNextPage);
            pageRef.current = page;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to fetch events:", err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const load = async () => {
            setLoading(true);
            await fetchPage(1, false);
            setLoading(false);
        };
        load();
    }, [fetchPage]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        await fetchPage(pageRef.current + 1, true);
        setLoadingMore(false);
    }, [loadingMore, hasMore, fetchPage]);

    return { posts, loading, loadingMore, hasMore, loadMore };
}
