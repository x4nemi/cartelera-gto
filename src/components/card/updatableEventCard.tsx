import { CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { Card, CardBody, Image, useDisclosure } from "@/compat/heroui"
import { EventDrawer } from "./eventDrawer"
import { EditEventModal } from "../modal/editEventModal"
import { DeleteEventModal } from "../modal/deleteEventModal"
import { CosmosAPI, PostData } from "@/config/apiClient"
import { EditIcon, TrashIcon, ViewIcon } from "../icons"

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
									/* Date badge — pinned to bottom-right so it doesn't cover poster titles. */
									<div
										className="absolute bottom-2 right-2 z-10 flex flex-col items-center overflow-hidden rounded-xl border border-default-300/60 bg-content2/80 backdrop-blur-md shadow-sm"
										style={{ width: 40 }}
									>
										<div className="w-full text-[8px] font-bold tracking-wider text-center pt-0.5">
											{month}
										</div>
										<div className="flex flex-col items-center w-full pb-0.5 pt-0 border-t border-default-300/60">
											<span className="font-semibold leading-tight font-mono text-sm">
												{day}
											</span>
											<span className="text-[8px] leading-tight pb-0.5">{weekday}</span>
										</div>
									</div>
								)}

							</>
						) : (
							<CardHeader className="absolute bottom-2 right-2 z-10 p-0 flex flex-col items-center overflow-hidden rounded-2xl">
								<Chip color="default" size="sm" className="self-end rounded-xl">
									Evento pasado
								</Chip>
							</CardHeader>
						)}
						{isPast && (
							<CardHeader className="absolute inset-0 z-9 p-0 flex items-center justify-center rounded-3xl bg-default-900/70 dark:bg-default-50/70">
							</CardHeader>
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
				<DropdownMenu aria-label="Acciones del evento" variant="soft">
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
