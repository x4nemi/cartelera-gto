/**
 * Lightweight "portal session" backed by localStorage.
 *
 * NOTE: This is NOT real authentication. It only remembers which IG username
 * the visitor claims to be so portal pages don't need `/:username/` prefixes.
 * Anyone with browser access can set/clear it. Replace this with a real auth
 * provider (Azure AD B2C / Clerk / email magic link) before going to GA.
 */

const STORAGE_KEY = "cgto.portal.username";
const EVENT_NAME = "cgto:portalSession";

export function getPortalUsername(): string | null {
    if (typeof window === "undefined") return null;
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setPortalUsername(username: string): void {
    if (typeof window === "undefined") return;
    const normalized = username.trim().toLowerCase();
    if (!normalized) return;
    try {
        window.localStorage.setItem(STORAGE_KEY, normalized);
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));
    } catch {
        // storage unavailable — ignore
    }
}

export function clearPortalSession(): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
    } catch {
        // ignore
    }
}

export const PORTAL_SESSION_EVENT = EVENT_NAME;
