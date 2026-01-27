import { Avatar, Button, Card, CardFooter, CardHeader, Link } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { EventModal } from "./eventModal"
import { useState } from "react"
import { ImageCarousel } from "./imageCarousel"

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

const postProperties = {
	event: {
		title: "Evento",
		className: "bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-300/20 dark:text-primary-600 dark:border-none"},
	workshop: {
		title: "Taller / Curso",
		className: "bg-secondary-50 text-secondary-700 border-secondary-100 dark:bg-secondary-300/20 dark:text-secondary-600 dark:border-none"},
	calendar: {
		title: "Calendario",
		className: "bg-lime-50 text-lime-700 border-lime-100 dark:bg-lime-300/20 dark:text-lime-300 dark:border-none"},
}

export const EventCard = (props: EventCardProps) => {
	const [openInfoModal, setOpenInfoModal] = useState(false)
	const eventDate = new Date(props.date);
	const month = months[eventDate.getMonth()];
	const day = eventDate.getDate();
	//#region Calendar

	//#endregion

	return (
		<>
			<Card className="group p-1 rounded-[20px]" shadow="lg">
				<CardHeader className="py-0 pb-1 px-0.5 flex justify-between text-foreground/60 text-xs font-semibold">
					<div className={postProperties[props.type || "event"].className + " p-1.5 pl-2 py-1 rounded-tr-md rounded-tl-[16px] rounded-b-md text-[10px] px-1 border-1"}>{postProperties[props.type || "event"].title}</div>
					<div className="flex border-1 border-default-200/50 text-center rounded-tl-md rounded-tr-[16px] rounded-b-md">
						<div className="text-[10px] bg-default-100 px-1 py-1 text-default-500 h-full">{month}</div>
						<div className="flex items-center justify-center font-semibold text-[10px] font-mono text-default-500 px-1 pr-2">
							{day}
						</div>
					</div>
				</CardHeader>
				<div
					className="cursor-pointer"
					onClick={() => setOpenInfoModal(true)}
					role="button"
					tabIndex={0}
					aria-label={`Ver detalles de ${props.title}`}
					onKeyDown={(e) => e.key === 'Enter' && setOpenInfoModal(true)}
				>
					<ImageCarousel images={[...props.image ? [props.image, props.image] : []].flat()} isCardEvent className="rounded-md" />
				</div>
				<CardFooter className="p-0 pt-1 flex justify-between items-center">
					<div className="flex h-full">
						<Avatar src={props.user?.avatarUrl} alt={props.user?.name || props.username} size="sm" classNames={{base:"rounded-bl-[16px] rounded-t-md rounded-br-md"}} />
						<div className="flex flex-col ml-2 justify-center">
							<p className="font-semibold text-foreground text-[10px] leading-tight">{props.user?.name || props.username}</p>
							<p className="text-[10px] text-foreground/60 leading-tight">@{props.user?.username || props.username}</p>
						</div>
					</div>
					<Button as={Link} showAnchorIcon size="sm" className="rounded-br-[16px] rounded-t-md rounded-bl-md" isIconOnly></Button>
				</CardFooter>
			</Card>
			<EventModal props={props} isOpen={openInfoModal} onClose={() => setOpenInfoModal(false)} />
		</>
	)
}
