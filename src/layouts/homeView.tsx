import { CategoriesDropdown } from "@/components/options/categoriesDropdown"
import { PriceRangesDropdown } from "@/components/options/priceRangesDropdown"
import { useEvents } from "@/hooks/useEvents"
import type { PostData } from "@/types"
import { Card, Typography } from "@heroui/react"
import { useEffect, useMemo, useRef, useState, Fragment } from "react"
import { Event } from "@/components/card/event"
import { Divider } from "@/compat/heroui"

const SHORT_WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const SHORT_MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const toDayKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const parseDayKey = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
};

/**
 * Bucket a free-text price into a tier matching the price slider:
 * 0 = Gratis, 1 = $, 2 = $$, 3 = $$$. Returns null when the price is unknown
 * (such posts are never hidden by the price filter).
 */
const priceTier = (price?: string): number | null => {
    if (!price) return null;
    const text = price.trim();
    if (!text) return null;

    const amounts = (text.match(/\$\s?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?/g) ?? [])
        .map((m) => Number(m.replace(/[^\d]/g, "")))
        .filter((n) => Number.isFinite(n) && n > 0);

    if (amounts.length === 0) {
        return /gratis|libre|sin costo|entrada libre/i.test(text) ? 0 : null;
    }
    const min = Math.min(...amounts);
    if (min <= 150) return 1;
    if (min <= 400) return 2;
    return 3;
};

export const HomeView = () => {
    const { posts, loading } = useEvents();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 3]);

    // Known category labels actually present in the loaded events' tags.
    // Until posts load, leave undefined so the dropdown shows all categories.
    const availableCategories = useMemo(() => {
        if (posts.length === 0) return undefined;
        const present = new Set<string>();
        for (const post of posts) {
            for (const tag of post.tags ?? []) present.add(tag.toLowerCase());
        }
        return Array.from(present);
    }, [posts]);

    // Apply category + price filters before grouping.
    const filteredPosts = useMemo(() => {
        const [minTier, maxTier] = priceRange;
        const priceActive = minTier > 0 || maxTier < 3;
        const cats = selectedCategories.map((c) => c.toLowerCase());

        return posts.filter((post) => {
            if (cats.length > 0) {
                const tags = (post.tags ?? []).map((t) => t.toLowerCase());
                if (!cats.some((c) => tags.includes(c))) return false;
            }
            if (priceActive) {
                const tier = priceTier(post.price);
                if (tier !== null && (tier < minTier || tier > maxTier)) return false;
            }
            return true;
        });
    }, [posts, selectedCategories, priceRange]);

    // Group posts by day key (YYYY-MM-DD), today and future only
    const grouped = useMemo(() => {
        const map = new Map<string, PostData[]>();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const post of filteredPosts) {
            for (const raw of post.dates ?? []) {
                const d = new Date(raw);
                if (isNaN(d.getTime())) continue;
                d.setHours(0, 0, 0, 0);
                if (d < today) continue;
                const key = toDayKey(d);
                if (!map.has(key)) map.set(key, []);
                map.get(key)!.push(post);
            }
        }
        return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
    }, [filteredPosts]);

    const dayKeys = useMemo(() => [...grouped.keys()], [grouped]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const isJumpingRef = useRef(false);

    const activeKey = selectedKey ?? dayKeys[0] ?? null;

    const jumpToDay = (key: string) => {
        isJumpingRef.current = true;
        setSelectedKey(key);
        sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
        // re-enable scroll-spy after the smooth scroll settles
        window.setTimeout(() => { isJumpingRef.current = false; }, 800);
    };

    // Scroll-spy: highlight the date whose section is currently in view
    useEffect(() => {
        if (dayKeys.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (isJumpingRef.current) return;
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (visible) {
                    const key = (visible.target as HTMLElement).dataset.daykey;
                    if (key) setSelectedKey(key);
                }
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );

        for (const key of dayKeys) {
            const el = sectionRefs.current[key];
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [dayKeys]);

    return (
        <div className="flex flex-col gap-4 pt-6 max-w-5xl mx-auto">
            <Card className="max-md:sticky max-md:top-4 z-20">
                <Card.Header>
                    <Typography type="h5">¿Qué es lo que buscas?</Typography>
                </Card.Header>
                <Card.Content className="flex flex-col gap-6">
                    <CategoriesDropdown
                        selectedCategories={selectedCategories}
                        onSelectionChange={setSelectedCategories}
                        availableCategories={availableCategories}
                    />
                    <PriceRangesDropdown value={priceRange} onChange={setPriceRange} />
                </Card.Content>
            </Card>

            {/* Date sidebar aligned to each section's divider */}
            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-6">
                {loading && dayKeys.length === 0 && (
                    <p className="col-span-2 text-sm text-foreground/60">Cargando eventos…</p>
                )}
                {!loading && dayKeys.length === 0 && (
                    <p className="col-span-2 text-sm text-foreground/60">No hay eventos próximos.</p>
                )}
                {dayKeys.map((key) => {
                    const date = parseDayKey(key);
                    const events = grouped.get(key) ?? [];
                    const isActive = key === activeKey;
                    return (
                        <Fragment key={key}>
                            {/* date button — always visible at top of its row; only active one sticks */}
                            <button
                                type="button"
                                onClick={() => jumpToDay(key)}
                                className={[
                                    "flex flex-col items-center w-12 py-1 rounded-xl border transition-colors self-start",
                                    isActive ? "sticky top-4 z-10" : "",
                                    isActive
                                        ? "bg-accent text-accent-foreground border-transparent"
                                        : "bg-content1 border-default/30 hover:border-default/60",
                                ].join(" ")}
                            >
                                <span className="text-[10px] uppercase tracking-wider opacity-70">
                                    {SHORT_WEEKDAYS[date.getDay()]}
                                </span>
                                <span className="text-xl font-display font-semibold leading-none mt-1">
                                    {date.getDate()}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider opacity-70 mt-1">
                                    {SHORT_MONTHS[date.getMonth()]}
                                </span>
                            </button>

                            <section
                                data-daykey={key}
                                ref={(el) => { sectionRefs.current[key] = el; }}
                                className="scroll-mt-4 flex flex-col gap-3 min-w-0"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3">
                                    {events.map((event) => (
                                        <Event key={`${event.shortCode}-${key}`} {...event} />
                                    ))}
                                </div>
                                <Divider />
                            </section>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    )
}
