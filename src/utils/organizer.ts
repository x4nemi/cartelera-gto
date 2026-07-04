import type { UserData } from "@/types";

/** Coerce an external-link entry (string or `{ url }` object) to a URL string. */
const asUrl = (e: unknown): string | null => {
    if (typeof e === "string") return e;
    if (e && typeof e === "object" && "url" in e) {
        const u = (e as { url?: unknown }).url;
        return typeof u === "string" ? u : null;
    }
    return null;
};

/** All external-link URLs for a user, regardless of stored shape. */
const extUrls = (user: UserData): string[] =>
    ((user.externalUrls as unknown[]) ?? []).map(asUrl).filter((u): u is string => !!u);

/**
 * Location lines pulled from the bio. Prefers lines marked with a 📍 pin
 * (organizers commonly list one line per sede that way).
 */
export function parseLocations(bio?: string): string[] {
    if (!bio) return [];
    return bio
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.includes("📍"))
        .map((l) => l.replace(/📍/g, "").trim())
        .filter(Boolean);
}

/** Instagram profile URL (from user.url). */
export function instagramUrl(user: UserData): string | null {
    return user.url && /instagram\.com/i.test(user.url) ? user.url : null;
}

/** Facebook URL if present in external links. */
export function facebookUrl(user: UserData): string | null {
    return extUrls(user).find((u) => /facebook\.com|fb\.com|fb\.me/i.test(u)) ?? null;
}

/**
 * WhatsApp link (wa.me). Prefers a wa.me/whatsapp link in external links,
 * otherwise parses a "WhatsApp <number>" mention in the bio.
 */
export function whatsappUrl(user: UserData): string | null {
    const link = extUrls(user).find((u) => /wa\.me|api\.whatsapp|whatsapp\.com/i.test(u));
    if (link) return link;

    const bio = user.biography || "";
    const m = bio.match(/whatsapp[^\d+]*(\+?\d[\d\s-]{8,})/i);
    if (m) {
        const digits = m[1].replace(/\D/g, "");
        if (digits.length >= 10) {
            const full = digits.length === 10 ? `52${digits}` : digits;
            return `https://wa.me/${full}`;
        }
    }
    return null;
}

/** Google Maps directions search for a location string within Guanajuato. */
export function mapsUrl(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location} Guanajuato`)}`;
}
