import DefaultLayout from "@/layouts/default";
import { FilterWidget } from "@/components/FilterWidget";
import { randomEvents } from "@/config/site";
import { Wall } from "@/components/pinterestWall";
import { EventCardProps } from "@/components/interfaces";
import { useEffect, useState } from "react";

export default function IndexPage() {
	const [months, setMonths] = useState<string[]>([]);

	const getMonths = (randomEvents: EventCardProps[]) => {
		const monthsSet = new Set<string>();
		randomEvents.forEach((event) => {
			const eventDate = new Date(event.date);
			const monthYear = eventDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
			monthsSet.add(monthYear);
		});
		return Array.from(monthsSet)
	}

	const splitEventsByMonth = (events: EventCardProps[], month: string) => {
		return events.filter((event) => {
			const eventDate = new Date(event.date);
			const eventMonthYear = eventDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
			return eventMonthYear === month;
		});
	}

	useEffect(() => {
		const uniqueMonths = getMonths(randomEvents);
		setMonths(uniqueMonths);
	}, []);
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 md:py-10">
				<div className="w-full justify-center">
					<FilterWidget />
				</div>

				{
					months.map((month) => (
						<>
							<h2 key={month} className="w-full text-2xl font-bold mt-2">
								{month.charAt(0).toUpperCase() + month.slice(1)}
							</h2>
							<Wall cardsData={splitEventsByMonth(randomEvents, month)} />
						</>
					))
				}
			</section>
		</DefaultLayout>
	);
}
