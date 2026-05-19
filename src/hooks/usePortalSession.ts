import { useEffect, useState } from "react";

import {
    getPortalUsername,
    PORTAL_SESSION_EVENT,
} from "@/config/portalSession";

/**
 * Reactive accessor for the current portal username.
 * Re-renders when `setPortalUsername` / `clearPortalSession` is called from
 * anywhere in the same tab, and when localStorage changes from another tab.
 */
export function usePortalSession(): string | null {
    const [username, setUsername] = useState<string | null>(() => getPortalUsername());

    useEffect(() => {
        const sync = () => setUsername(getPortalUsername());

        window.addEventListener(PORTAL_SESSION_EVENT, sync);
        window.addEventListener("storage", sync);

        return () => {
            window.removeEventListener(PORTAL_SESSION_EVENT, sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    return username;
}
