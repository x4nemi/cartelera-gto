import { CosmosAPI, UserData } from "@/config/apiClient";
import { clearPortalSession } from "@/config/portalSession";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Simple in-memory cache so the user is only fetched once per username
const userCache = new Map<string, UserData>();

export type UseRequireUserOptions = {
    /** Where to send the visitor when the user is missing / not approved. Defaults to "/". */
    redirectTo?: string;
    /** If true, also clear the portal session on redirect. Useful for portal-side pages. */
    clearSessionOnReject?: boolean;
};

/**
 * Hook that fetches a user by username, verifies they exist and are approved,
 * and redirects to home if not. Caches the result so subsequent calls for the
 * same username return instantly without a loading spinner or API call.
 */
export function useRequireUser(
    username: string | undefined,
    options: UseRequireUserOptions = {},
) {
    const { redirectTo = "/", clearSessionOnReject = false } = options;
    const navigate = useNavigate();

    const cached = username ? userCache.get(username) : undefined;
    const [user, setUser] = useState<UserData | null>(cached ?? null);
    const [loading, setLoading] = useState(!cached);

    useEffect(() => {
        if (!username) {
            navigate(redirectTo);
            return;
        }

        // Already cached — skip the fetch entirely
        if (userCache.has(username)) {
            setUser(userCache.get(username)!);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const reject = () => {
            if (clearSessionOnReject) clearPortalSession();
            navigate(redirectTo);
        };

        const fetchUser = async () => {
            try {
                const response = await CosmosAPI.getUser(username);
                if (!cancelled) {
                    if (response?.username && response.status === "approved") {
                        userCache.set(username, response);
                        setUser(response);
                    } else {
                        reject();
                    }
                }
            } catch {
                if (!cancelled) reject();
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchUser();

        return () => { cancelled = true; };
    }, [username, navigate, redirectTo, clearSessionOnReject]);

    const refresh = useCallback(async () => {
        if (!username) return;
        try {
            const response = await CosmosAPI.getUser(username);
            if (response?.username) {
                userCache.set(username, response);
                setUser(response);
            }
        } catch { /* ignore */ }
    }, [username]);

    return { user, loading, refresh };
}

/** Clear the cached user (e.g. on logout or profile deletion) */
export function clearUserCache(username?: string) {
    if (username) {
        userCache.delete(username);
    } else {
        userCache.clear();
    }
}
