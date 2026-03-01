import { Card, CardBody, CardHeader, Chip, Image, useDisclosure } from "@heroui/react"
import { EventDrawer } from "./eventDrawer"
import { PostData } from "@/config/apiClient"

const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export const EventCard = (props: PostData) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const parseLocalDate = (dateStr: string) => {
		const [y, m, d] = dateStr.split("-").map(Number);
		return new Date(y, m - 1, d);
	};
	const eventDate = () => {
		if (props.dates && props.dates.length > 0) {
			//get the closest date to today
			const sortedDates = props.dates
				.map(date => parseLocalDate(date))
				.sort((a, b) => Math.abs(a.getTime() - today.getTime()) - Math.abs(b.getTime() - today.getTime()));
			return sortedDates[0];
		}
		return new Date();
	}

	const date = eventDate();
	const month = months[date.getMonth()];
	const day = date.getDate();
	const weekday = weekdays[date.getDay()];

	const isPast = props.dates ? props.dates.every(d => parseLocalDate(d) < today) : false;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Card className="rounded-3xl transition-all duration-200" isPressable onClick={onOpen} shadow="none">
				{!isPast ? (
					<CardHeader className="absolute top-2 right-2 z-10 p-0 flex flex-col items-center overflow-hidden rounded-2xl w-9" style={{ width: 45 }}>
						<div className="w-full bg-foreground text-white dark:bg-content1 text-[9px] font-bold tracking-wider text-center pt-1">{month}</div>
						<div className="flex flex-col items-center bg-content1 dark:bg-default-900 w-full py-1">
							<span className=" font-semibold leading-tight text-foreground dark:text-default-50 font-mono text-md">{day}</span>
							<span className="text-[9px] text-default-500">{weekday}</span>
						</div>
					</CardHeader>) :
					<CardHeader className="absolute top-2 right-2 z-10 p-0 flex flex-col items-center overflow-hidden rounded-2xl">
						<Chip color="danger" size="md" className="self-end rounded-2xl">Evento pasado</Chip>
					</CardHeader>
				}
				{ isPast && (
					<CardHeader className="absolute inset-0 z-9 p-0 flex items-center justify-center rounded-3xl bg-default-900/30 dark:bg-default-50/30">
					</CardHeader>
				)}

				<CardBody className="overflow-visible p-0">
					<Image
						removeWrapper
						alt="Card background"
						className={"z-0 w-full h-full object-cover rounded-3xl"}
						src={props.displayUrl}
					/>
				</CardBody>
			</Card>
			<EventDrawer isOpen={isOpen} onOpenChange={onOpenChange} cardProps={props} />
		</>
	)
}
