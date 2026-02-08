import { Card, CardBody, CardHeader, Image, useDisclosure } from "@heroui/react"
import { EventDrawer } from "./eventDrawer"
import { PostData } from "@/config/apiClient"

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export const EventCard = (props: PostData) => {
	const today = new Date();
	const eventDate = () => {
		if (props.dates && "dates" in props.dates && props.dates.dates.length > 0) {
			// return the most recent date after today, if there are multiple dates
			const futureDates = props.dates.dates.filter(date => new Date(date.toString()) >= today);
			if (futureDates.length > 0) {
				return new Date(futureDates[0].toString());
			}
		} else if (props.dates && "workshopDays" in props.dates && props.dates.workshopDays.length > 0) {
			// return the most recent date after today, if there are multiple workshop days
			const futureWorkshopDates = props.dates.workshopDays.filter(date => new Date(date.toString()) >= today);
			if (futureWorkshopDates.length > 0) {
				return new Date(futureWorkshopDates[0].toString());
			}
		} else if (props.dates && "dateRange" in props.dates && props.dates.dateRange.start) {
			// max between today and the start of the date range
			const startDate = new Date(props.dates.dateRange.start.toString());
			return startDate >= today ? startDate : today;
		}
		return today; // default to today if no dates are available
	}
		
	const month = months[eventDate().getMonth()];
	const day = eventDate().getDate();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Card className="rounded-3xl" isPressable onClick={onOpen} isFooterBlurred>
				<CardHeader className="absolute top-1 right-1 z-10 bg-content2/70 backdrop-blur-md p-0 w-auto flex flex-row border border-default-200/50 text-center rounded-tl-md rounded-tr-[20px] rounded-b-md">
					<div className="max-md:text-[12px] md:text-[14px] p-1 pl-2 text-default-500">{month}</div>
					<div className="flex items-center bg-content2 justify-center font-semibold max-md:text-[11px] md:text-[13px] font-mono text-default-500 p-2 pt-2 rounded-tl-[5px] rounded-tr-[19px] rounded-b-[5px]">
						{day}
					</div>
				</CardHeader>

				<CardBody className="overflow-visible p-0">
					<Image
						removeWrapper
						alt="Card background"
						className="z-0 w-full h-full object-cover rounded-3xl"
						src={props.displayUrl}
					/>
				</CardBody>
			</Card>
			<EventDrawer isOpen={isOpen} onOpenChange={onOpenChange} cardProps={props} />
		</>
	)
}
