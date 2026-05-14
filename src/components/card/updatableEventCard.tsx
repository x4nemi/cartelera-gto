import { Card, CardBody, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, useDisclosure } from "@heroui/react"
import { EventDrawer } from "./eventDrawer"
import { EditEventModal } from "../modal/editEventModal"
import { DeleteEventModal } from "../modal/deleteEventModal"
import { CosmosAPI, PostData } from "@/config/apiClient"
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
	const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
	return (
		<>
			<Dropdown size="lg">
				<DropdownTrigger>
					<Card className="rounded-3xl transition-all duration-200 group" isPressable shadow="none">
						{!isPast ? (
							<>
								{props.type !== "calendar" && (
									<CardHeader
										className="absolute top-2 right-2 z-10 p-0 flex flex-col items-center overflow-hidden rounded-2xl bg-content1/80 dark:bg-content1/70 backdrop-blur-md ring-1 ring-default-200/60 dark:ring-default-100/40 shadow-sm"
										style={{ width: 45 }}
									>
										<div className="w-full text-[9px] font-bold tracking-wider text-center pt-1 text-default-700 dark:text-default-500">
											{month}
										</div>
										<div className="flex flex-col items-center w-full pb-1 pt-0.5 border-t border-default-200/60 dark:border-default-100/40">
											<span className="font-semibold leading-tight font-mono text-md text-foreground">
												{day}
											</span>
											<span className="text-[9px] text-default-600 dark:text-default-400">
												{weekday}
											</span>
										</div>
									</CardHeader>
								)}
								<CardHeader className="absolute top-2 left-2 z-10 p-0">
									<EventTypeChip type={props.type} />
								</CardHeader>
							</>
						) : (
							<CardHeader className="absolute top-2 right-2 z-10 p-0">
								<Chip color="default" size="sm" variant="flat" className="rounded-2xl bg-content1/80 dark:bg-content1/70 backdrop-blur-md ring-1 ring-default-200/60 dark:ring-default-100/40">
									Evento pasado
								</Chip>
							</CardHeader>
						)}
						{isPast && (
							<CardHeader className="absolute inset-0 z-[9] p-0 rounded-3xl bg-background/60 dark:bg-background/70 pointer-events-none" />
						)}

						<CardBody className="overflow-visible p-0">
							<Image
								removeWrapper
								alt="Card background"
								className={"z-0 w-full h-auto object-contain rounded-3xl"}
								src={props.images?.[0]}
							/>
						</CardBody>
					</Card>
				</DropdownTrigger>
				<DropdownMenu aria-label="Acciones del evento" variant="flat">
					<DropdownItem key="view" startContent={<ViewIcon size={20} />} onPress={onDrawerOpen}>Ver evento</DropdownItem>
					<DropdownItem key="edit" startContent={<EditIcon size={20} />} onPress={onEditOpen}>Editar evento</DropdownItem>
					<DropdownItem key="delete" className="text-danger" color="danger" startContent={<TrashIcon size={20} />} onPress={onDeleteOpen}>
						Eliminar evento
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<EventDrawer isOpen={isDrawerOpen} onOpenChange={onDrawerOpenChange} cardProps={props} />
			<EditEventModal isOpen={isEditOpen} onOpenChange={onEditOpenChange} postData={props} onUpdated={() => onPostUpdated?.()} />
			<DeleteEventModal
				isOpen={isDeleteOpen}
				onOpenChange={onDeleteOpenChange}
				onDelete={async () => {
					try {
						await CosmosAPI.deleteEvent(props.shortCode);
						onPostUpdated?.();
					} catch {
						alert("No se pudo eliminar el evento. Intenta de nuevo.");
					}
				}}
			/>
		</>
	)
}
