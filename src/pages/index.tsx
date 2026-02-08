import DefaultLayout from "@/layouts/default";
import { FilterWidget } from "@/components/filterWidget";
import { randomEvents } from "@/config/site";
import { Wall } from "@/components/pinterestWall";
import { useMemo, useState } from "react";
export default function IndexPage() {
	const [isAscendingOrder, setIsAscendingOrder] = useState(true)

	const orderedEvents = useMemo(() => {
		return [...randomEvents].sort((a, b) => {
			const dateA = a.dates && a.dates.length > 0
				? Math.min(...a.dates.map(date => new Date(date.year, date.month - 1, date.day).getTime()))
				: new Date().getTime();
			const dateB = b.dates && b.dates.length > 0
				? Math.min(...b.dates.map(date => new Date(date.year, date.month - 1, date.day).getTime()))
				: new Date().getTime();
			return isAscendingOrder ? dateA - dateB : dateB - dateA;
		});
	}, [isAscendingOrder]);

	// const splitEventsByMonth = (events: PostData[], month: string) => {
	// 	return events.filter((event) => {
	// 		const eventDate = new Date(// get the first date after today if exists, else the first date
	// 			event.dates && event.dates.length > 0
	// 				? Math.min(
	// 					...event.dates.map(date => new Date(date.year, date.month - 1, date.day).getTime())
	// 				)
	// 				: new Date().getTime()
	// 		);
	// 		const eventMonthYear = eventDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
	// 		return eventMonthYear === month;
	// 	});
	// }

	// const months = useMemo(() => {
	// 	const monthsSet = new Set<string>();
	// 	orderedEvents.forEach((event : PostData) => {
	// 		const eventDate = new Date(// get the first date after today if exists, else the first date
	// 			event.dates && event.dates.length > 0
	// 				? Math.min(
	// 					...event.dates.map(date => new Date(date.year, date.month - 1, date.day).getTime())
	// 				)
	// 				: new Date().getTime()
	// 		);
	// 		const monthYear = eventDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
	// 		monthsSet.add(monthYear);
	// 	});
	// 	return Array.from(monthsSet);
	// }, [orderedEvents]);
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center md:gap-4 gap-2 -mt-10 relative mx-2">
				<div className="container mx-auto justify-center transition-all duration-300">
					<div>
						<FilterWidget isAscending={isAscendingOrder} setIsAscending={setIsAscendingOrder}/>
					</div>

				</div>

				<Wall cardsData={orderedEvents} />
			</section>
		</DefaultLayout>
	);
}
