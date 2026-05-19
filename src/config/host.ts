/**
 * Domain-aware app routing.
 *
 * The same Vite build is served from both `cartelera-gto.com` (public)
 * and `portal.cartelera-gto.com` (business). `getAppHost()` decides
 * which route tree / navbar to render based on the current hostname.
 *
 * For local dev, set `VITE_FORCE_HOST=portal` (or `=public`) to override.
 */

export type AppHost = "public" | "portal";

const PORTAL_HOSTNAMES = new Set<string>([
    "portal.cartelera-gto.com",
    "portal.localhost",
]);

export function getAppHost(): AppHost {
    const forced = (import.meta.env.VITE_FORCE_HOST as string | undefined)?.toLowerCase();
    if (forced === "portal" || forced === "public") return forced;

    if (typeof window === "undefined") return "public";

    const hostname = window.location.hostname.toLowerCase();
    if (PORTAL_HOSTNAMES.has(hostname)) return "portal";
    if (hostname.startsWith("portal.")) return "portal";
    return "public";
}

export const isPortalHost = (): boolean => getAppHost() === "portal";
export const isPublicHost = (): boolean => getAppHost() === "public";
