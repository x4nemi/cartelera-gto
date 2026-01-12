import { Button, Card, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Link } from "@heroui/react"
import { EventCardProps } from "./interfaces"
import { EventModal } from "./eventModal"
import { useState } from "react"
import { CalendarIcon } from "./icons"

export const EventCard = (props: EventCardProps) => {
	const [openInfoModal, setOpenInfoModal] = useState(false)
	return (
		<>
			<Card className="group p-1 rounded-3xl" shadow="lg">

				<Image
					removeWrapper
					alt="Card example background"
					className="z-0 w-full h-full rounded-[20px] object-cover"
					src={props.image}
				/>
				<CardFooter className="absolute p-2 bottom-0 left-0 right-0 bg-opacity-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center gap-2">
					<Button
						className="rounded-bl-[16px] text-white w-full"
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
				<Dropdown>
					<DropdownTrigger>
						<Button variant="solid" size="sm" className="absolute mt-1 ml-1 rounded-tl-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" startContent={<CalendarIcon size={16} />} isIconOnly></Button>
					</DropdownTrigger>
					<DropdownMenu aria-label="Static Actions">
						<DropdownItem key="new">New file</DropdownItem>
						<DropdownItem key="copy">Copy link</DropdownItem>
						<DropdownItem key="edit">Edit file</DropdownItem>
						<DropdownItem key="delete" className="text-danger" color="danger">
							Delete file
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</Card>
			<EventModal props={props} isOpen={openInfoModal} onClose={() => setOpenInfoModal(false)} />
		</>
	)
}
