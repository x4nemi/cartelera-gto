import { Button, Card, CardHeader, Link, useDisclosure } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { ImageCarousel } from "./imageCarousel"
import { EventDrawer } from "./eventDrawer"

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export const EventCard = (props: EventCardProps) => {
	const eventDate = new Date(props.date);
	const month = months[eventDate.getMonth()];
	const day = eventDate.getDate();
	
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const isMobile = window.innerWidth < 768;
	return (
		<>
			<Card className="group p-1 rounded-[20px]" shadow="lg" isPressable isHoverable onClick={onOpen}>
				<CardHeader className="py-0 pb-1 px-0 flex justify-between text-foreground/60 text-xs font-semibold">
					<div className="flex flex-row border-1 border-default-200/50 text-center rounded-tr-md rounded-tl-[16px] rounded-b-md">
						<div className="max-md:text-[12px] md:text-[14px] p-2 pb-1 text-default-500">{month}</div>
						<div className="flex items-center bg-content2 justify-center font-semibold max-md:text-[11px] md:text-[13px] font-mono text-default-500 p-2 rounded-r-md">
							{day}
						</div>
					</div>
					<Button as={Link} showAnchorIcon size="sm" className="rounded-tr-[16px] rounded-b-md rounded-tl-md transition-all duration-200 text-[14px]" isIconOnly={isMobile}>{isMobile ? "" : "Ir al sitio"}</Button>
				</CardHeader>
				<div
					role="button"
					tabIndex={0}
					aria-label={`Ver detalles de ${props.title}`}
				>
					<ImageCarousel images={[...props.image ? [props.image, props.image] : []].flat()} isCardEvent className="rounded-b-[16px] rounded-t-md" />
				</div>
			</Card>
			<EventDrawer isOpen={isOpen} onOpenChange={onOpenChange} cardProps={props} />
		</>
	)
}
