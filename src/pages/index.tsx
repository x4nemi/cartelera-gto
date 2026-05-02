import DefaultLayout from "@/layouts/default";
import { Wall } from "@/layouts/pinterestWall";
import { CalendarFeed } from "@/layouts/calendarFeed";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { FilterBar } from "@/components/filterBar";
import { SadIcon } from "@/components/icons";
import { ViewToggle, HomeViewMode } from "@/components/viewToggle";
import { useEvents } from "@/hooks/useEvents";
import { Spinner } from "@heroui/react";

export default function IndexPage() {
	const { posts, loading, loadingMore, hasMore, loadMore } = useEvents();

	const [viewMode, setViewMode] = useState<HomeViewMode>("wall");
	const [isAscendingOrder, setIsAscendingOrder] = useState(true);
	const [selectedUsernames, setSelectedUsernames] = useState<Set<string> | null>(null);

	const parseLocalDate = (d: string) => {
		const [y, m, day] = d.split("-").map(Number);
		return new Date(y, m - 1, day);
	};

	const defaultDateRange = useMemo(() => {
		const allDates = posts.flatMap(e => e.dates ?? []).map(d => parseLocalDate(d));
		if (allDates.length === 0) return { start: null, end: null };
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const earliest = new Date(Math.min(...allDates.map(d => d.getTime())));
		return {
			start: earliest < today ? today : earliest,
			end: new Date(Math.max(...allDates.map(d => d.getTime())))
		};
	}, [posts]);
	const [minDate, setMinDate] = useState<Date | null>(null);
	const [maxDate, setMaxDate] = useState<Date | null>(null);

	const [eventTypes, setEventTypes] = useState<string[]>(["event", "workshop", "calendar"]);

	// Initialize selectedUsernames when posts first load
	useEffect(() => {
		if (posts.length > 0 && selectedUsernames === null) {
			const all = new Set<string>();
			posts.forEach(e => { if (e.ownerUsername) all.add(e.ownerUsername); });
			setSelectedUsernames(all);
		}
	}, [posts, selectedUsernames]);

	// Update selectedUsernames when new posts arrive with new users
	useEffect(() => {
		if (selectedUsernames === null) return;
		const newUsernames = new Set(selectedUsernames);
		let changed = false;
		posts.forEach(e => {
			if (e.ownerUsername && !newUsernames.has(e.ownerUsername)) {
				newUsernames.add(e.ownerUsername);
				changed = true;
			}
		});
		if (changed) setSelectedUsernames(newUsernames);
	}, [posts]);

	const applyDateRange = useCallback((start: Date, end: Date) => {
		setMinDate(start);
		setMaxDate(end);
	}, []);

	const toggleUser = useCallback((username: string) => {
		setSelectedUsernames(prev => {
			if (!prev) return prev;
			const next = new Set(prev);
			if (next.has(username)) {
				next.delete(username);
			} else {
				next.add(username);
			}
			return next;
		});
	}, []);

	const effectiveMinDate = minDate ?? defaultDateRange.start;
	const effectiveMaxDate = maxDate ?? defaultDateRange.end;

	const filteredEvents = useMemo(() => {
		const activeUsernames = selectedUsernames ?? new Set<string>();
		return [...posts]
			.filter(e => activeUsernames.has(e.ownerUsername))
			.filter(e => eventTypes.includes(e.type || "event"))
			.filter(e => {
				if (!e.dates || e.dates.length === 0) return true;
				return e.dates.some(d => {
					const date = parseLocalDate(d);
					if (effectiveMinDate && date < effectiveMinDate) return false;
					if (effectiveMaxDate && date > effectiveMaxDate) return false;
					return true;
				});
			})
			.sort((a, b) => {
				const dateA = a.dates && a.dates.length > 0
					? Math.min(...a.dates.map(date => parseLocalDate(date).getTime()))
					: 0;
				const dateB = b.dates && b.dates.length > 0
					? Math.min(...b.dates.map(date => parseLocalDate(date).getTime()))
					: 0;
				return isAscendingOrder ? dateA - dateB : dateB - dateA;
			});
	}, [isAscendingOrder, selectedUsernames, effectiveMinDate, effectiveMaxDate, eventTypes, posts]);

	// Calendar view applies user/type filters but ignores date-range filter
	// (the calendar widget itself acts as the date selector).
	const calendarEvents = useMemo(() => {
		const activeUsernames = selectedUsernames ?? new Set<string>();
		return posts
			.filter(e => activeUsernames.has(e.ownerUsername))
			.filter(e => eventTypes.includes(e.type || "event"));
	}, [posts, selectedUsernames, eventTypes]);

	const allUsernamesAndPics = useMemo(() => {
		const map = new Map<string, { username: string; profilePicUrl: string }>();
		posts.forEach(e => {
			if (e.ownerUsername && e.ownerProfilePicUrl && !map.has(e.ownerUsername)) {
				map.set(e.ownerUsername, { username: e.ownerUsername, profilePicUrl: e.ownerProfilePicUrl });
			}
		});
		return Array.from(map.values());
	}, [posts]);

	const removeAllFilters = useCallback(() => {
		setSelectedUsernames(new Set(allUsernamesAndPics.map(u => u.username)));
		setMinDate(null);
		setMaxDate(null);
		setIsAscendingOrder(true);
		setEventTypes(["event", "workshop", "calendar"]);
	}, [allUsernamesAndPics]);

	const areFiltersApplied = useMemo(() => {
		const allUsernames = new Set(allUsernamesAndPics.map(u => u.username));
		const activeUsernames = selectedUsernames ?? new Set<string>();
		const isUserFilterApplied = ![...activeUsernames].every(username => allUsernames.has(username)) || activeUsernames.size !== allUsernames.size;
		const isDateFilterApplied = (minDate !== null && minDate.getTime() !== defaultDateRange.start?.getTime()) || (maxDate !== null && maxDate.getTime() !== defaultDateRange.end?.getTime());
		const isOrderFilterApplied = !isAscendingOrder;
		const isEventTypeFilterApplied = eventTypes.length !== 3 || !eventTypes.includes("event") || !eventTypes.includes("workshop") || !eventTypes.includes("calendar");
		return isUserFilterApplied || isDateFilterApplied || isOrderFilterApplied || isEventTypeFilterApplied;
	}, [selectedUsernames, minDate, maxDate, isAscendingOrder, eventTypes, defaultDateRange]);

	// Infinite scroll sentinel
	const sentinelRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!sentinelRef.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loadingMore) {
					loadMore();
				}
			},
			{ rootMargin: "400px" }
		);
		observer.observe(sentinelRef.current);
		return () => observer.disconnect();
	}, [hasMore, loadingMore, loadMore]);

	return (
		<DefaultLayout>
			<section className="flex flex-col items-stretch w-full md:gap-4 gap-2 mt-5">
				{!loading && posts.length > 0 && (
					<div className="flex justify-end">
						<ViewToggle value={viewMode} onChange={setViewMode} />
					</div>
				)}

				{loading ? (
					<div className="flex justify-center items-center py-20">
						<Spinner size="lg" />
					</div>
				) : viewMode === "calendar" ? (
					<CalendarFeed posts={calendarEvents} />
				) : (
					<>
						{filteredEvents.length === 0 && areFiltersApplied && (
							<div className="flex flex-col justify-center items-center py-20 text-foreground/50 gap-2">
								<SadIcon size={48} />
								<p className="text-lg">No se encontraron eventos con los filtros seleccionados.</p>
							</div>
						)}
						<Wall cardsData={filteredEvents} />

						{/* Infinite scroll sentinel */}
						<div ref={sentinelRef} className="w-full h-1" />

						{loadingMore && (
							<div className="flex justify-center py-6">
								<Spinner size="md" />
							</div>
						)}
					</>
				)}

				{posts.length > 0 && viewMode === "wall" && (
					<div className="fixed bottom-4 inset-x-0 z-20 flex justify-center">
						<FilterBar allUsers={allUsernamesAndPics} selectedUsernames={selectedUsernames ?? new Set()} onToggleUser={toggleUser} setIsAscendingOrder={setIsAscendingOrder} onApplyDateRange={applyDateRange} removeAllFilters={removeAllFilters} setEventTypes={setEventTypes} eventTypes={eventTypes} />
					</div>
				)}
			</section>
		</DefaultLayout>
	);
}
