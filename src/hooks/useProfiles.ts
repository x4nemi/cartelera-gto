import { CosmosAPI, UserData } from "@/config/apiClient";
import { useCallback, useEffect, useRef, useState } from "react";

type StatusOption = "draft" | "pending" | "approved" | "rejected" | "all";

export function useProfiles(status?: StatusOption) {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await CosmosAPI.getUsers(status ? { status } : {});
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, refresh: fetchUsers };
}
