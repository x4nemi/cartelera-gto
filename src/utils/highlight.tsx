import { ReactNode } from "react";

/**
 * Wrap every case-insensitive occurrence of `query` inside `text` with a
 * yellow highlight. Returns the original text when there's no query/match.
 */
export function highlightMatch(text: string | undefined, query?: string): ReactNode {
    const q = query?.trim();
    if (!q || !text) return text;

    const lower = text.toLowerCase();
    const ql = q.toLowerCase();
    if (!lower.includes(ql)) return text;

    const parts: ReactNode[] = [];
    let i = 0;
    let key = 0;
    let idx = lower.indexOf(ql, i);
    while (idx !== -1) {
        if (idx > i) parts.push(text.slice(i, idx));
        parts.push(
            <mark
                key={key++}
                className="rounded bg-amber-300/50 px-0.5 text-inherit dark:bg-amber-400/40"
            >
                {text.slice(idx, idx + ql.length)}
            </mark>
        );
        i = idx + ql.length;
        idx = lower.indexOf(ql, i);
    }
    if (i < text.length) parts.push(text.slice(i));
    return parts;
}
