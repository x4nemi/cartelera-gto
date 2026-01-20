import DefaultLayout from "@/layouts/default";
import { FilterWidget } from "@/components/filterWidget";
import { randomEvents } from "@/config/site";
import { Wall } from "@/components/pinterestWall";
import { EventCardProps } from "@/components/interfaces";
import { useMemo, useState } from "react";
import { Alert } from "@heroui/react";
import { SmileyIcon } from "@/components/icons";
import { CalendarCard } from "@/components/calendarCard";
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

	const orderedCalendarEvents = useMemo(() => {
		return [...randomEvents].filter((event) => event.isCalendarEvent).sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return isAscendingOrder ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
		});
	}, [isAscendingOrder, isEventsView]);

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 -mt-10">
				<div className="container mx-auto justify-center transition-all duration-300">
					<Alert title="¡Bienvenido a Cartelera Guanajuato!" variant="faded" className="mb-4" icon={<SmileyIcon size={30} />} description="Explora los eventos de marcas locales en Guanajuato." isClosable color="primary" />
					<FilterWidget isAscending={isAscendingOrder} setIsAscending={setIsAscendingOrder} isEventsView={isEventsView} setIsEventsView={setIsEventsView} />
				</div>

				{ isEventsView &&
					months.map((month) => (
						<div key={month}>
							<h2 className="w-full text-2xl font-bold my-2">
								{month.charAt(0).toUpperCase() + month.slice(1)}
							</h2>
							<Wall cardsData={splitEventsByMonth(orderedEvents, month)} key={`wall-${month}`} />
						</div>
					))
				}
				{ !isEventsView &&
					orderedCalendarEvents.length > 0 && (
						orderedCalendarEvents.map((event, index) => (
							<CalendarCard key={`calendar-event-${index}`} {...event} />
						))
					)
				}
			</section>
		</DefaultLayout>
	);
}
