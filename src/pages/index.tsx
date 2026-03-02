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
			.sort((a, b) => {
			const dateA = a.dates && a.dates.length > 0
				? Math.min(...a.dates.map(date => new Date(date).getTime()))
				: 0;
			const dateB = b.dates && b.dates.length > 0
				? Math.min(...b.dates.map(date => new Date(date).getTime()))
				: 0;
			return isAscendingOrder ? dateA - dateB : dateB - dateA;
		});
	}, [isAscendingOrder, selectedUsernames]);

	const allUsernamesAndPics = useMemo(() => {
		const all = new Set<{username: string, profilePicUrl: string}>();
		filteredEvents.forEach(e => {
			if (e.ownerUsername && e.ownerProfilePicUrl) {
				all.add({username: e.ownerUsername, profilePicUrl: e.ownerProfilePicUrl});
			}
		});
		return Array.from(all);
	}, [filteredEvents]);

	return (
		<DefaultLayout>
			<section className="flex flex-col items-stretch w-full md:gap-4 gap-2 mt-5 relative">
				<div className="absolute -bottom-10 inset-x-0 z-20 p-4 flex justify-center">
					<FilterBar allUsers={allUsernamesAndPics} selectedUsernames={selectedUsernames} onToggleUser={toggleUser} setIsAscendingOrder={setIsAscendingOrder} />
				</div>

				<Wall cardsData={filteredEvents} />
			</section>
		</DefaultLayout>
	);
}
