import DefaultLayout from "@/layouts/default";
import { FilterWidget } from "@/components/FilterWidget";
import { randomEvents } from "@/config/site";
import { Wall } from "@/components/pinterestWall";

export default function IndexPage() {
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 md:py-10">
				<div className="w-full justify-center">
					<FilterWidget />
				</div>
	
				<Wall cardsData={randomEvents} />
			</section>
		</DefaultLayout>
	);
}
