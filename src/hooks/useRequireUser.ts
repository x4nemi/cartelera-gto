import { CosmosAPI, UserData } from "@/config/apiClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Simple in-memory cache so the user is only fetched once per username
const userCache = new Map<string, UserData>();

/**
 * Hook that fetches a user by username, verifies they exist and are approved,
 * and redirects to home if not. Caches the result so subsequent calls for the
 * same username return instantly without a loading spinner or API call.
 */
export function useRequireUser(username: string | undefined) {
    const navigate = useNavigate();

    const cached = username ? userCache.get(username) : undefined;
    const [user, setUser] = useState<UserData | null>(cached ?? null);
    const [loading, setLoading] = useState(!cached);

    useEffect(() => {
        if (!username) {
            navigate("/");
            return;
        }

        // Already cached — skip the fetch entirely
        if (userCache.has(username)) {
            setUser(userCache.get(username)!);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchUser = async () => {
            try {
                const response = await CosmosAPI.getUser(username);
                if (!cancelled) {
                    if (response?.username && response.isApproved) {
                        userCache.set(username, response);
                        setUser(response);
                    } else {
                        navigate("/");
                    }
                }
            } catch {
                if (!cancelled) navigate("/");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchUser();

        return () => { cancelled = true; };
    }, [username, navigate]);

    return { user, loading };
}

/** Clear the cached user (e.g. on logout or profile deletion) */
export function clearUserCache(username?: string) {
    if (username) {
        userCache.delete(username);
    } else {
        userCache.clear();
    }
}
