import { Button, Card, CardFooter, CardHeader, Link } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { EventModal } from "./eventModal"
import { useState } from "react"
import { ImageCarousel } from "./imageCarousel"

export const EventCard = (props: EventCardProps) => {
	const [openInfoModal, setOpenInfoModal] = useState(false)
	const eventDate = 
		props.isRecurrent ? "Recurrente" :
			new Date(props.date).toLocaleDateString('es-MX', {
				day: 'numeric',
				month: 'long',
			}) + (props.hour ? ", " + props.hour + " hrs" : "");

	//#region Calendar
	
	//#endregion

	return (
		<>
			<Card className="group p-1 rounded-3xl" shadow="lg">
				<CardHeader className="py-0 pb-1 flex justify-center text-foreground/60 text-xs font-semibold">{eventDate}</CardHeader>
				<div 
					className="cursor-pointer" 
					onClick={() => setOpenInfoModal(true)}
					role="button"
					tabIndex={0}
					aria-label={`Ver detalles de ${props.title}`}
					onKeyDown={(e) => e.key === 'Enter' && setOpenInfoModal(true)}
				>
					<ImageCarousel images={[...props.image ? [props.image, props.image] : []].flat()} isCardEvent className="rounded-[20px]" />
				</div>
				<CardFooter className="absolute p-2 bottom-0 left-0 right-0 bg-opacity-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center gap-2">
					<Button
						className="rounded-bl-[16px] w-full"
						color="default"
						onPress={() => setOpenInfoModal(true)}
						size="sm"
					>
						Información
					</Button>
					<Button
						color="secondary"
						className="w-full rounded-br-[16px]"
						showAnchorIcon
						as={Link}
						size="sm"
					>
						Sitio
					</Button>
				</CardFooter>
			</Card>
			<EventModal props={props} isOpen={openInfoModal} onClose={() => setOpenInfoModal(false)} />
		</>
	)
}
