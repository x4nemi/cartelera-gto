import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { ArrowLeft, Magnifier } from "@gravity-ui/icons";

import { EventCard } from "@/components/eventCard";
import { Navbar } from "@/components/navbar";
import { useEvents } from "@/hooks/useEvents";
import { PostData } from "@/types";

const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Earliest upcoming date (iso + time) for a post. */
const getDisplay = (post: PostData, todayIso: string) => {
    const dates = [...(post.dates ?? [])].sort();
    if (dates.length === 0) return null;
    const pick = dates.find((d) => d.slice(0, 10) >= todayIso) ?? dates[0];
    const time = pick.length >= 16 && pick[10] === "T" ? pick.slice(11, 16) : null;
    return { iso: pick.slice(0, 10), time };
};

const matchesQuery = (post: PostData, q: string) => {
    const haystack = [
        post.title,
        post.location,
        post.owner?.fullName,
        post.owner?.username,
        ...(post.tags ?? []),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    return haystack.includes(q);
};

export const Search = () => {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const { posts, loading } = useEvents();
    const [query, setQuery] = useState(params.get("q") ?? "");

    useEffect(() => {
        setQuery(params.get("q") ?? "");
    }, [params]);

    const todayIso = toIso(new Date());
    const q = (params.get("q") ?? "").trim().toLowerCase();

    const results = q
        ? posts
              .map((post) => ({ post, disp: getDisplay(post, todayIso) }))
              .filter((x): x is { post: PostData; disp: { iso: string; time: string | null } } =>
                  !!x.disp && matchesQuery(x.post, q)
              )
              .sort((a, b) =>
                  a.disp.iso === b.disp.iso
                      ? (a.disp.time || "99:99").localeCompare(b.disp.time || "99:99")
                      : a.disp.iso.localeCompare(b.disp.iso)
              )
        : [];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const next = query.trim();
        setParams(next ? { q: next } : {});
    };

    return (
        <div className="mx-auto min-h-dvh w-full max-w-xl px-4 pb-28 pt-6 md:max-w-5xl md:pt-24">
            <div className="mx-auto mb-4 flex w-full max-w-xl flex-col gap-3 md:hidden">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex w-fit items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Regresar
                </button>
                <h1 className="text-h2">Buscar</h1>
                <form onSubmit={submit} className="relative w-full">
                    <Magnifier className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="¿Qué te interesa buscar?"
                        aria-label="Buscar eventos"
                        className="w-full rounded-full border border-default-200 bg-default-100/40 py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-default-300"
                    />
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <Spinner size="lg" />
                </div>
            ) : !q ? (
                <p className="py-10 text-center text-sm text-muted">
                    Escribe algo para buscar entre los eventos próximos.
                </p>
            ) : results.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">
                    Sin resultados para “{params.get("q")}”.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map(({ post, disp }) => (
                        <EventCard
                            key={post._id ?? post.shortCode}
                            event={post}
                            time={disp.time}
                            highlight={params.get("q") ?? undefined}
                        />
                    ))}
                </div>
            )}

            <Navbar />
        </div>
    );
};
