import { Card, CardBody, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, useDisclosure } from "@heroui/react"
import { EventDrawer } from "./eventDrawer"
import { EditEventModal } from "../modal/editEventModal"
import { PostData } from "@/config/apiClient"
import { EditIcon, TrashIcon, ViewIcon } from "../icons"
import { EventTypeChip } from "./eventTypeChip"

const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export const UpdatableEventCard = ({ onPostUpdated, ...props }: PostData & { onPostUpdated?: () => void }) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const parseLocalDate = (dateStr: string) => {
		const [y, m, d] = dateStr.split("-").map(Number);
		return new Date(y, m - 1, d);
	};
	const eventDate = () => {
		if (props.dates && props.dates.length > 0) {
			//get the dates that are today or in the future
			const futureDates = props.dates
				.map(date => parseLocalDate(date))
				.filter(date => date >= today)
				.sort((a, b) => Math.abs(a.getTime() - today.getTime()) - Math.abs(b.getTime() - today.getTime()));
			if (futureDates.length > 0) {
				return futureDates[0];
			}
			//if all dates are in the past, return the closest past date
			const pastDates = props.dates
				.map(date => parseLocalDate(date))
				.filter(date => date < today)
				.sort((a, b) => Math.abs(a.getTime() - today.getTime()) - Math.abs(b.getTime() - today.getTime()));
			if (pastDates.length > 0) {
				return pastDates[0];
			}
		}
		return new Date();
	}

	const date = eventDate();
	const month = months[date.getMonth()];
	const day = date.getDate();
	const weekday = weekdays[date.getDay()];

	const isPast = props.dates ? props.dates.every(d => parseLocalDate(d) < today) : false;

	const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onOpenChange: onDrawerOpenChange } = useDisclosure();
	const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
	return (
		<>
			<Dropdown size="lg">
				<DropdownTrigger>
					<Card className="rounded-3xl transition-all duration-200" isPressable shadow="none">
						{!isPast ? (
							<>
							{ props.type !== "calendar" &&
								<CardHeader className="absolute top-2 right-2 z-10 p-0 flex flex-col items-center overflow-hidden rounded-2xl w-9 border-2 border-default-300" style={{ width: 45 }}>
									<div className="w-full bg-content2 text-[9px] font-bold tracking-wider text-center pt-1 ">{month}</div>
									<div className="flex flex-col items-center bg-content2 w-full pb-1 pt-0.5 border-t border-default-300">
										<span className=" font-semibold leading-tight font-mono text-md">{day}</span>
										<span className="text-[9px]">{weekday}</span>
									</div>
								</CardHeader>
							}
								<CardHeader className="absolute top-2 left-2 z-10 p-0">
									<EventTypeChip type={props.type} />
								</CardHeader>
							</>
						) :
							<CardHeader className="absolute top-2 right-2 z-10 p-0 flex flex-col items-center overflow-hidden rounded-2xl">
								<Chip color="danger" size="md" className="self-end rounded-2xl">Evento pasado</Chip>
							</CardHeader>
						}
						{isPast && (
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
				</DropdownTrigger>
				<DropdownMenu aria-label="Static Actions" variant="flat">
					<DropdownItem key="view" startContent={<ViewIcon size={20} />} onPress={onDrawerOpen}>Ver evento</DropdownItem>
					<DropdownItem key="edit" startContent={<EditIcon size={20} />} onPress={onEditOpen}>Editar evento</DropdownItem>
					<DropdownItem key="delete" className="text-danger" color="danger" startContent={<TrashIcon size={20} />} onPress={() => alert("Eliminar evento")}>
						Eliminar evento
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<EventDrawer isOpen={isDrawerOpen} onOpenChange={onDrawerOpenChange} cardProps={props} />
			<EditEventModal isOpen={isEditOpen} onOpenChange={onEditOpenChange} postData={props} onUpdated={() => onPostUpdated?.()} />
		</>
	)
}
