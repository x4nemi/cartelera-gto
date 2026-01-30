import DefaultLayout from "@/layouts/default";
import { FilterWidget } from "@/components/filterWidget";
import { randomEvents } from "@/config/site";
import { Wall } from "@/components/pinterestWall";
import { EventCardProps } from "@/components/interfaces";
import { useMemo, useState } from "react";
export default function IndexPage() {
	const [isAscendingOrder, setIsAscendingOrder] = useState(true)
	const [isEventsView, setIsEventsView] = useState(true)

	const splitEventsByMonth = (events: EventCardProps[], month: string) => {
		return events.filter((event) => {
			const eventDate = new Date(event.date);
			const eventMonthYear = eventDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
			return eventMonthYear === month;
		});
	}

	const orderedEvents = useMemo(() => {
		return [...randomEvents].filter(event => !event.isCalendarEvent).sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return isAscendingOrder ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
		});
	}, [isAscendingOrder]);

	const months = useMemo(() => {
		const monthsSet = new Set<string>();
		orderedEvents.forEach((event) => {
			const eventDate = new Date(event.date);
			const monthYear = eventDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
			monthsSet.add(monthYear);
		});
		return Array.from(monthsSet);
	}, [orderedEvents]);
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center md:gap-4 gap-2 -mt-10 relative mx-2">
				<div className="container mx-auto justify-center transition-all duration-300">
					<div>
						<FilterWidget isAscending={isAscendingOrder} setIsAscending={setIsAscendingOrder} isEventsView={isEventsView} setIsEventsView={setIsEventsView} />
					</div>

				</div>

				{
					months.map((month) => (
						<div key={month}>
							<h2 className="w-full text-2xl font-bold my-2">
								{month.charAt(0).toUpperCase() + month.slice(1)}
							</h2>
							<Wall cardsData={splitEventsByMonth(orderedEvents, month)} key={`wall-${month}`} />
						</div>
					))
				}
			</section>
		</DefaultLayout>
	);
}
