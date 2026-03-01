import { useMemo } from "react";
import { EventCard } from "./card/eventCard";
import { PostData } from "@/config/apiClient";
import { UpdatableEventCard } from "./card/updatableEventCard";

/**
 * Wall layout for the portal page.
 * Always left-aligned, always uses 3 columns on md+ and 2 on mobile,
 * even if there is only one post.
 */
export const PortalWall = ({ cardsData = [], onPostUpdated }: { cardsData?: PostData[]; onPostUpdated?: () => void }) => {
	const numColumns = 3; // always distribute into 3 columns (CSS hides 3rd on small screens)

	const { column1, column2, column3 } = useMemo(() => {
		return {
			column1: cardsData.filter((_, i) => i % numColumns === 0),
			column2: cardsData.filter((_, i) => i % numColumns === 1),
			column3: cardsData.filter((_, i) => i % numColumns === 2),
		};
	}, [cardsData]);

	return (
		<div className="w-full">
			<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 max-sm:gap-1.5 transition-all duration-200">
				<div className="flex flex-col gap-3 max-sm:gap-1.5">
					{column1.map((card, index) => (
						<div key={`col1-${index}`} className="card-wrapper">
							<UpdatableEventCard {...card} onPostUpdated={onPostUpdated} />
						</div>
					))}
				</div>
				<div className="flex flex-col gap-3 max-sm:gap-1.5">
					{column2.map((card, index) => (
						<div key={`col2-${index}`} className="card-wrapper">
							<UpdatableEventCard {...card} onPostUpdated={onPostUpdated} />
						</div>
					))}
				</div>
				<div className="hidden lg:flex flex-col gap-3 max-sm:gap-1.5">
					{column3.map((card, index) => (
						<div key={`col3-${index}`} className="card-wrapper">
							<UpdatableEventCard {...card} onPostUpdated={onPostUpdated} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
