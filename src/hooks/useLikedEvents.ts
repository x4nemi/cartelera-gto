import { useSyncExternalStore } from "react";

import { PostData } from "@/types";

const STORAGE_KEY = "likedEvents";
const EMPTY: PostData[] = [];

function read(): PostData[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as PostData[]) : EMPTY;
    } catch {
        return EMPTY;
    }
}

let cache: PostData[] = read();
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((l) => l());
}

function persist(next: PostData[]) {
    cache = next;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // Ignore quota / private-mode write errors; in-memory state still updates.
    }
    emit();
}

// Keep state in sync when likes change in another browser tab.
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY) {
            cache = read();
            emit();
        }
    });
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return cache;
}

const keyOf = (event: PostData) => event._id ?? event.shortCode;

export function isEventLiked(event: PostData) {
    const k = keyOf(event);
    return cache.some((e) => keyOf(e) === k);
}

export function toggleLike(event: PostData) {
    const k = keyOf(event);
    if (cache.some((e) => keyOf(e) === k)) {
        persist(cache.filter((e) => keyOf(e) !== k));
    } else {
        persist([event, ...cache]);
    }
}

/** Reactive list of liked events, persisted in localStorage. */
export function useLikedEvents() {
    return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** Reactive boolean for whether a single event is liked. */
export function useIsLiked(event: PostData) {
    const liked = useLikedEvents();
    const k = keyOf(event);
    return liked.some((e) => keyOf(e) === k);
}
