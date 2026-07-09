import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CosmosAPI } from "@/config/apiClient";
import { useProfiles } from "@/hooks/useProfiles";
import type { PostData, UserData } from "@/types";

const initials = (u: UserData) => (u.fullName || u.username).slice(0, 2).toUpperCase();

const MAX_BUBBLES = 15;
const R_MIN = 20;
const R_MAX = 42;
const MORE_RADIUS = 28;

/** Greedy spiral circle-packing: bigger circles first land near the center, the
 *  rest spiral outwards to the first non-overlapping spot. Deterministic. */
function packCircles(radii: number[], gap = 4): { x: number; y: number }[] {
    const placed: { x: number; y: number; r: number }[] = [];
    for (const r of radii) {
        if (placed.length === 0) {
            placed.push({ x: 0, y: 0, r });
            continue;
        }
        let spot = { x: 0, y: 0 };
        for (let a = 0; a < 5000; a++) {
            const angle = a * 0.35;
            const dist = a * 0.5;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            if (placed.every((p) => Math.hypot(p.x - x, p.y - y) >= p.r + r + gap)) {
                spot = { x, y };
                break;
            }
        }
        placed.push({ x: spot.x, y: spot.y, r });
    }
    return placed.map(({ x, y }) => ({ x, y }));
}

type Entry =
    | { kind: "user"; u: UserData; count: number; r: number }
    | { kind: "more"; count: number; r: number };

export const OrganizersBubbles = () => {
    const { users, loading } = useProfiles();
    const navigate = useNavigate();
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [showAll, setShowAll] = useState(false);

    // Count upcoming events per organizer → bubble size.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const map: Record<string, number> = {};
            let page = 1;
            for (let guard = 0; guard < 20; guard++) {
                const res = await CosmosAPI.getEvents({ page, limit: 100, upcoming: true });
                res.data.forEach((p: PostData) => {
                    const k = p.ownerUsername || p.owner?.username;
                    if (k) map[k] = (map[k] || 0) + 1;
                });
                if (!res.pagination?.hasNextPage) break;
                page++;
            }
            if (!cancelled) setCounts(map);
        })().catch(() => {
            /* leave sizes uniform if counting fails */
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const layout = useMemo(() => {
        if (users.length === 0) return null;

        const sorted = [...users].sort(
            (a, b) => (counts[b.username] || 0) - (counts[a.username] || 0)
        );
        const userCounts = sorted.map((u) => counts[u.username] || 0);
        const maxC = Math.max(1, ...userCounts);
        const minC = Math.min(...userCounts);
        const radiusOf = (c: number) => {
            const t = maxC > minC ? (c - minC) / (maxC - minC) : 0.45;
            return R_MIN + t * (R_MAX - R_MIN);
        };

        const collapsed = !showAll && sorted.length > MAX_BUBBLES;
        const shown = collapsed ? sorted.slice(0, MAX_BUBBLES) : sorted;
        const entries: Entry[] = shown.map((u) => ({
            kind: "user",
            u,
            count: counts[u.username] || 0,
            r: radiusOf(counts[u.username] || 0),
        }));
        if (collapsed) {
            entries.push({ kind: "more", count: sorted.length - MAX_BUBBLES, r: MORE_RADIUS });
        }

        // Pack biggest-first (center-out), then map positions back to entries.
        const order = entries.map((e, i) => ({ e, i })).sort((a, b) => b.e.r - a.e.r);
        const positions = packCircles(order.map((o) => o.e.r));
        const nodes = order.map((o, k) => ({ ...o, x: positions[k].x, y: positions[k].y }));

        const minX = Math.min(...nodes.map((n) => n.x - n.e.r));
        const maxX = Math.max(...nodes.map((n) => n.x + n.e.r));
        const minY = Math.min(...nodes.map((n) => n.y - n.e.r));
        const maxY = Math.max(...nodes.map((n) => n.y + n.e.r));

        // "Destacado" threshold = 2nd-highest count (the 2-3 biggest bubbles).
        const topCounts = [...userCounts].sort((a, b) => b - a);
        const threshold = topCounts[1] ?? topCounts[0] ?? 0;

        return {
            nodes,
            cx: (minX + maxX) / 2,
            minY,
            width: maxX - minX,
            height: maxY - minY,
            threshold,
        };
    }, [users, counts, showAll]);

    if (loading || !layout) return null;

    return (
        <section className="w-full">
            <div
                className="rounded-3xl px-4 py-6 text-center"
                style={{ backgroundColor: "var(--surface-secondary)" }}
            >
                <h2 className="text-h3">Ellos ya están en la cartelera</h2>
                <p className="mt-1 text-sm text-muted">
                    {users.length} espacios y colectivos · entre más grande la burbuja, más eventos publican
                </p>

                <div
                    className="bubble-area relative mx-auto my-6 w-full"
                    style={{ height: layout.height, maxWidth: layout.width }}
                >
                    {layout.nodes.map((n) => {
                        const d = n.e.r * 2;
                        const left = `calc(50% + ${n.x - n.e.r - layout.cx}px)`;
                        const top = `${n.y - n.e.r - layout.minY}px`;
                        const dur = 4.4 + (n.i % 5) * 0.5; // 4.4s – 6.4s, each its own rhythm
                        const delay = (n.i % 7) * 0.3; // staggered start
                        const common = {
                            left,
                            top,
                            width: d,
                            height: d,
                            animation: `bubbleFloat ${dur}s ease-in-out ${delay}s infinite`,
                        };

                        if (n.e.kind === "more") {
                            return (
                                <button
                                    key="more"
                                    type="button"
                                    onClick={() => setShowAll(true)}
                                    aria-label={`Ver ${n.e.count} organizadores más`}
                                    className="bubble absolute flex items-center justify-center rounded-full text-sm font-semibold text-muted transition-transform duration-300 hover:scale-110"
                                    style={{
                                        ...common,
                                        border: "1px dashed color-mix(in oklch, var(--foreground) 30%, transparent)",
                                    }}
                                >
                                    +{n.e.count}
                                </button>
                            );
                        }

                        const { u, count } = n.e;
                        const destacado = count > 0 && count >= layout.threshold;
                        return (
                            <button
                                key={u.username}
                                type="button"
                                onClick={() => navigate(`/eventos/${u.username}`)}
                                title={u.fullName || u.username}
                                aria-label={u.fullName || u.username}
                                className="bubble group absolute"
                                style={common}
                            >
                                <span
                                    className="block h-full w-full overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: "color-mix(in oklch, var(--accent) 14%, var(--surface))",
                                        boxShadow: destacado
                                            ? "0 0 0 2px var(--accent), 0 0 22px color-mix(in oklch, var(--accent) 45%, transparent)"
                                            : "0 0 0 2px color-mix(in oklch, var(--accent) 30%, transparent)",
                                    }}
                                >
                                    {u.profilePicUrl ? (
                                        <img
                                            src={u.profilePicUrl}
                                            alt={u.fullName || u.username}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center text-sm font-semibold">
                                            {initials(u)}
                                        </span>
                                    )}
                                </span>
                                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface px-2 py-0.5 text-xs font-medium opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100">
                                    {u.fullName || u.username}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <p className="text-xs text-muted">Toca una burbuja para ver su perfil y sus eventos</p>
            </div>
        </section>
    );
};
