import { Card, CardBody, CardHeader, Image, useDisclosure } from "@heroui/react"
import { EventDrawer } from "./eventDrawer"
import { PostData } from "@/config/apiClient"

const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export const EventCard = (props: PostData) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const eventDate = () => {
		if (props.dates && props.dates.length > 0) {
			//get the closest date to today
			const sortedDates = props.dates
				.map(date => new Date(date))
				.sort((a, b) => Math.abs(a.getTime() - today.getTime()) - Math.abs(b.getTime() - today.getTime()));
			return sortedDates[0];
		}
		return new Date();
	}
		
	const date = eventDate();
	const month = months[date.getMonth()];
	const day = date.getDate();
	const weekday = weekdays[date.getDay()];

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Card className="rounded-3xl" isPressable onClick={onOpen} shadow="none">
				<CardHeader className="absolute top-2 right-2 z-10 p-0 w-auto flex flex-col items-center overflow-hidden rounded-xl border border-content1" style={{ width: 50 }}>
					<div className="w-full bg-foreground text-white dark:text-black text-[11px] font-bold tracking-wider text-center pt-0.5">{month}</div>
					<div className="flex flex-col items-center bg-content1 w-full py-1">
						<span className="text-xl font-semibold leading-tight text-foreground">{day}</span>
						<span className="text-[11px] text-default-500">{weekday}</span>
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
