import { CosmosAPI, UserData } from "@/config/apiClient";
import { useCallback, useEffect, useRef, useState } from "react";

export function useProfiles() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await CosmosAPI.getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, refresh: fetchUsers };
}
