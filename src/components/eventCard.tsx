import { Card, CardBody, CardHeader, Image, useDisclosure } from "@heroui/react"
import { EventDrawer } from "./eventDrawer"
import { PostData } from "@/config/apiClient"

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

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
