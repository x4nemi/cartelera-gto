import { useEffect, useRef, useState } from "react";
import { CosmosAPI } from "@/config/apiClient";
import type { PostData, UserData } from "@/types";

/** Fetch a single organizer profile by username. */
export function useProfile(username: string) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!username || fetchedRef.current === username) return;
        fetchedRef.current = username;
        setLoading(true);
        CosmosAPI.getUser(username)
            .then(setUser)
            .catch((e) => console.error("Failed to fetch profile:", e))
            .finally(() => setLoading(false));
    }, [username]);

    return { user, loading };
}

/** Fetch all upcoming published events for a given organizer. */
export function useOrganizerEvents(username: string) {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!username || fetchedRef.current === username) return;
        fetchedRef.current = username;
        setLoading(true);
        CosmosAPI.getEvents({ ownerUsername: username, upcoming: true, limit: 100 })
            .then((r) => setPosts(r.data))
            .catch((e) => console.error("Failed to fetch organizer events:", e))
            .finally(() => setLoading(false));
    }, [username]);

    return { posts, loading };
}
