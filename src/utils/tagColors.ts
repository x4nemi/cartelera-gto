// Deterministic category colors shared by the weekly views (week strip + recurrentes).

const CATEGORY_COLOR: Record<string, string> = {
    musica: "#3b82f6",
    taller: "#14b8a6",
    cine: "#f59e0b",
    arte: "#ec4899",
    gastronomia: "#f97316",
    danza: "#8b5cf6",
    teatro: "#ef4444",
    literatura: "#a855f7",
    conferencia: "#0ea5e9",
    exposicion: "#6366f1",
    festival: "#eab308",
    deporte: "#22c55e",
    infantil: "#d946ef",
    comunidad: "#84cc16",
    fiesta: "#f43f5e",
};

// Fallback palette so any unmapped tag still gets a distinct, stable color.
const PALETTE = [
    "#3b82f6", "#14b8a6", "#f59e0b", "#ec4899", "#f97316",
    "#8b5cf6", "#ef4444", "#a855f7", "#0ea5e9", "#6366f1",
    "#eab308", "#22c55e", "#d946ef", "#84cc16", "#f43f5e",
];

const hashTag = (tag: string) => {
    let h = 0;
    for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
    return h;
};

/** Stable color for a category/tag. */
export const colorForTag = (tag: string) =>
    CATEGORY_COLOR[tag] ?? PALETTE[hashTag(tag) % PALETTE.length];
