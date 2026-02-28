import { CosmosAPI, UserData } from "@/config/apiClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook that fetches a user by username, verifies they exist and are approved,
 * and redirects to home if not. Returns the user and loading state.
 */
export function useRequireUser(username: string | undefined) {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            navigate("/");
            return;
        }

        let cancelled = false;

        const fetchUser = async () => {
            try {
                const response = await CosmosAPI.getUser(username);
                if (!cancelled) {
                    if (response?.username && response.isApproved) {
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
