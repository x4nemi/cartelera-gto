import { Button, Card, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { EventModal } from "./eventModal"
import { useState } from "react"
import { CalendarIcon } from "./icons"

export const EventCard = (props: EventCardProps) => {
	const [openInfoModal, setOpenInfoModal] = useState(false)

	//#region Calendar
	const hasSpecificDate = !!props.date;
	const calendarOptions = [
		{
			Title: "Agregar a Outlook",
			Url: `https://outlook.office.com/owa/?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(props.title)}&body=${encodeURIComponent(props.description || "")}&startdt=${encodeURIComponent(new Date(props.date).toISOString())}&enddt=${encodeURIComponent(new Date(new Date(props.date).getTime() + 60 * 60 * 1000).toISOString())}&location=${encodeURIComponent(props.user?.location || "")}&allday=false`
		},
		{
			Title: "Agregar a Google Calendar",
			Url: `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(props.title)}&dates=${encodeURIComponent(new Date(props.date).toISOString().replace(/-|:|\.\d+/g, ''))}/${encodeURIComponent(new Date(new Date(props.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ''))}&details=${encodeURIComponent(props.description || "")}&location=${encodeURIComponent(props.user?.location || "")}&sf=true&output=xml`
		},
		{
			Title: "Agregar a otro calendario",
			Url: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
		VERSION:2.0
		BEGIN:VEVENT
		SUMMARY:${encodeURIComponent(props.title)}
		DTSTART:${encodeURIComponent(new Date(props.date).toISOString().replace(/-|:|\.\d+/g, ''))}
		DTEND:${encodeURIComponent(new Date(new Date(props.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ''))}
		DESCRIPTION:${encodeURIComponent(props.description || "")}
		LOCATION:${encodeURIComponent(props.user?.location || "")}
		END:VEVENT
		END:VCALENDAR`
		}
	]
	//#endregion

	return (
		<>
			<Card className="group p-1 rounded-3xl" shadow="lg">
				<div 
					className="cursor-pointer" 
					onClick={() => setOpenInfoModal(true)}
					role="button"
					tabIndex={0}
					aria-label={`Ver detalles de ${props.title}`}
					onKeyDown={(e) => e.key === 'Enter' && setOpenInfoModal(true)}
				>
					<Image
						removeWrapper
						alt="Card example background"
						className="z-0 w-full h-full rounded-[20px] object-cover"
						src={props.image}
					/>
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
				{hasSpecificDate &&
					<Dropdown placement="bottom-end" size="sm">
						<DropdownTrigger>
							<Button variant="solid" size="sm" className="absolute mt-1 ml-1 rounded-tl-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" startContent={<CalendarIcon size={16} />} >{props.date + ", " + props.hour + "hrs"}</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label="Static Actions">
							{calendarOptions.map(({ Title, Url }) => {
								return (
									<DropdownItem
										key={Title}
										// as={Link}
										href={Url}
										className="text-xs"
									>
										{Title}
									</DropdownItem>
								)
							})}
						</DropdownMenu>
					</Dropdown>
				}
			</Card>
			<EventModal props={props} isOpen={openInfoModal} onClose={() => setOpenInfoModal(false)} />
		</>
	)
}
