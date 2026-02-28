import { CosmosAPI, PostData } from "@/config/apiClient";
import { useEffect, useState } from "react";

const postsCache = new Map<string, PostData[]>();

/**
 * Hook that fetches posts for a given username.
 * Caches results so navigating back doesn't re-fetch.
 */
export function useUserPosts(username: string | undefined) {
    const cached = username ? postsCache.get(username) : undefined;
    const [posts, setPosts] = useState<PostData[]>(cached ?? []);
    const [loading, setLoading] = useState(!cached);

    useEffect(() => {
        if (!username) return;

        if (postsCache.has(username)) {
            setPosts(postsCache.get(username)!);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchPosts = async () => {
            try {
                const response = await CosmosAPI.getEvents({ ownerUsername: username, limit: 50 });
                if (!cancelled) {
                    postsCache.set(username, response.data);
                    setPosts(response.data);
                }
            } catch {
                // silently fail
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchPosts();

        return () => { cancelled = true; };
    }, [username]);

    return { posts, loading };
}

/** Invalidate cached posts (e.g. after publishing a new one) */
export function clearPostsCache(username?: string) {
    if (username) {
        postsCache.delete(username);
    } else {
        postsCache.clear();
    }
}
