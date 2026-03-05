import DefaultLayout from "@/layouts/default";
import { randomEvents } from "@/config/site";
import { Wall } from "@/layouts/pinterestWall";
import { useMemo, useState, useCallback } from "react";
import { FilterBar } from "@/components/filterBar";

export default function IndexPage() {
	const [isAscendingOrder, setIsAscendingOrder] = useState(true)
	const [selectedUsernames, setSelectedUsernames] = useState<Set<string>>(() => {
		const all = new Set<string>();
		randomEvents.forEach(e => { if (e.ownerUsername) all.add(e.ownerUsername); });
		return all;
	});
	
	const defaultDateRange = useMemo(() => {
		const allDates = randomEvents.flatMap(e => e.dates ?? []).map(d => new Date(d));
		if (allDates.length === 0) return { start: null, end: null };
		return {
			start: new Date(Math.min(...allDates.map(d => d.getTime()))),
			end: new Date(Math.max(...allDates.map(d => d.getTime())))
		};
	}, []);
	const [minDate, setMinDate] = useState<Date | null>(defaultDateRange.start);
	const [maxDate, setMaxDate] = useState<Date | null>(defaultDateRange.end);

	const [eventTypes, setEventTypes] = useState<string[]>(["event", "workshop", "calendar"]);

	const applyDateRange = useCallback((start: Date, end: Date) => {
		setMinDate(start);
		setMaxDate(end);
	}, []);

	const toggleUser = useCallback((username: string) => {
		setSelectedUsernames(prev => {
			const next = new Set(prev);
			if (next.has(username)) {
				next.delete(username);
			} else {
				next.add(username);
			}
			return next;
		});
	}, []);

	const filteredEvents = useMemo(() => {
		return [...randomEvents]
			.filter(e => selectedUsernames.has(e.ownerUsername))
			.filter(e => eventTypes.includes(e.type || "event"))
			.filter(e => {
				if (!e.dates || e.dates.length === 0) return true
				return e.dates.some(d => {
					const date = new Date(d);
					if (minDate && date < minDate) return false;
					if (maxDate && date > maxDate) return false;
					return true;
				});
			})
			.sort((a, b) => {
			const dateA = a.dates && a.dates.length > 0
				? Math.min(...a.dates.map(date => new Date(date).getTime()))
				: 0;
			const dateB = b.dates && b.dates.length > 0
				? Math.min(...b.dates.map(date => new Date(date).getTime()))
				: 0;
			return isAscendingOrder ? dateA - dateB : dateB - dateA;
		});
	}, [isAscendingOrder, selectedUsernames, minDate, maxDate, eventTypes]);

	const allUsernamesAndPics = useMemo(() => {
		const all = new Set<{username: string, profilePicUrl: string}>();
		randomEvents.forEach(e => {
			if (e.ownerUsername && e.ownerProfilePicUrl) {
				all.add({username: e.ownerUsername, profilePicUrl: e.ownerProfilePicUrl});
			}
		});
		return Array.from(all);
	}, []);

	const removeAllFilters = useCallback(() => {
		setSelectedUsernames(new Set(allUsernamesAndPics.map(u => u.username)));
		setMinDate(defaultDateRange.start);
		setMaxDate(defaultDateRange.end);
		setIsAscendingOrder(true);
		setEventTypes(["event", "workshop", "calendar"]);
	}, []);

	return (
		<DefaultLayout>
			<section className="flex flex-col items-stretch w-full md:gap-4 gap-2 mt-5 relative">
				<div className="absolute -bottom-10 inset-x-0 z-20 p-4 flex justify-center">
					<FilterBar allUsers={allUsernamesAndPics} selectedUsernames={selectedUsernames} onToggleUser={toggleUser} setIsAscendingOrder={setIsAscendingOrder} onApplyDateRange={applyDateRange} removeAllFilters={removeAllFilters} setEventTypes={setEventTypes} eventTypes={eventTypes} />
				</div>

				<Wall cardsData={filteredEvents} />
			</section>
		</DefaultLayout>
	);
}
