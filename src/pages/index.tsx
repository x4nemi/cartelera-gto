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
				? Math.min(...a.dates.map(date => new Date(date).getTime()))
				: 0;
			const dateB = b.dates && b.dates.length > 0
				? Math.min(...b.dates.map(date => new Date(date).getTime()))
				: 0;
			return isAscendingOrder ? dateA - dateB : dateB - dateA;
		});
	}, [isAscendingOrder]);
	
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center md:gap-4 gap-2 mt-5 relative md:mx-auto mx-1">
				<div className="container justify-center transition-all duration-300">
					{/* <div>
						<FilterWidget isAscending={isAscendingOrder} setIsAscending={setIsAscendingOrder}/>
					</div> */}

				</div>

				<Wall cardsData={orderedEvents} />
			</section>
		</DefaultLayout>
	);
}
