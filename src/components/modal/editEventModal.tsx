import { PostData, updatePost } from "@/config/apiClient";
import { EventDates } from "@/components/dates/tabs";
import { ImageGallery } from "@/components/image/imageGallery";
import {
	addToast,
	Button,
	DateValue,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useState } from "react";

interface EditEventModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	postData: PostData;
	onUpdated?: (updatedPost: PostData) => void;
}

export const EditEventModal = ({ isOpen, onOpenChange, postData, onUpdated }: EditEventModalProps) => {
	const [caption, setCaption] = useState(postData.caption || "");
	const [isSaving, setIsSaving] = useState(false);

	// Date selection state
	const [selectedDates, setSelectedDates] = useState<DateValue[]>(() => {
		if (postData.dates && postData.dates.length > 0) {
			return postData.dates.map((d) => parseDate(d));
		}
		return [];
	});
	const [workshopDays, setWorkshopDays] = useState<string[]>([]);
	const [every, setEvery] = useState<number>(1);
	const [until, setUntil] = useState<DateValue | null>(null);
	const [dateRange, setDateRange] = useState<{ start: DateValue | null; end: DateValue | null }>({
		start: null,
		end: null,
	});
	const [type, setType] = useState<"event" | "workshop" | "calendar" | "draft">(postData.type || "event");

	const computeFlatDates = (): string[] => {
		if (type === "event") {
			return selectedDates
				.map((d) => {
					const { year, month, day } = d;
					return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
				})
				.sort();
		}

		if (type === "workshop" && workshopDays.length > 0 && until) {
			const jsMap: Record<string, number> = { "0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 0 };
			const targetDays = workshopDays.map((d) => jsMap[d]);
			const endDate = new Date(until.year, until.month - 1, until.day);
			const dates: string[] = [];
			const cursor = new Date();
			cursor.setHours(0, 0, 0, 0);

			while (cursor <= endDate) {
				if (targetDays.includes(cursor.getDay())) {
					dates.push(cursor.toISOString().split("T")[0]);
				}
				cursor.setDate(cursor.getDate() + 1);
			}

			if (every > 1) {
				return dates.filter((_dateStr, idx) => {
					// group by week, keep every Nth week
					return Math.floor(idx / workshopDays.length) % every === 0;
				});
			}
			return dates;
		}

		if (type === "calendar" && dateRange.start && dateRange.end) {
			const start = new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day);
			const end = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day);
			const dates: string[] = [];
			const cursor = new Date(start);
			while (cursor <= end) {
				dates.push(cursor.toISOString().split("T")[0]);
				cursor.setDate(cursor.getDate() + 1);
			}
			return dates;
		}

		return [];
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const dates = computeFlatDates();
			const updatedPostData: PostData = {
				...postData,
				caption,
				type,
				dates: dates.length > 0 ? dates : postData.dates,
			};

			const result = await updatePost(updatedPostData);
			addToast({
				title: "Evento actualizado",
				description: "Los cambios se han guardado correctamente.",
				color: "success",
				timeout: 5000,
				variant: "flat",
			});
			onUpdated?.(result);
			onOpenChange(false);
		} catch {
			addToast({
				title: "Error al guardar",
				description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
				color: "danger",
				timeout: 5000,
				variant: "flat",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const images = postData.images?.map((url) => ({ src: url })) ||
		(postData.displayUrl ? [{ src: postData.displayUrl }] : []);

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="4xl" scrollBehavior="inside" className="rounded-3xl">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">Editar evento</ModalHeader>
						<ModalBody>
							<div className="flex flex-col md:flex-row gap-4">
								{/* Left: Images */}
								{images.length > 0 && (
									<div className="md:w-1/2 shrink-0">
										<p className="text-small text-foreground-700 mb-2">Imágenes</p>
										<ImageGallery images={images} />
									</div>
								)}

								{/* Right: Caption + Dates */}
								<div className="flex flex-col gap-3 flex-1 min-w-0">
									<Textarea
										label="Descripción"
										labelPlacement="outside"
										placeholder="Describe tu evento aquí"
										value={caption}
										onValueChange={setCaption}
										variant="bordered"
										className="w-full"
									/>

									<EventDates
										selectedDays={selectedDates}
										setSelectedDays={setSelectedDates}
										workshopDays={workshopDays}
										setWorkshopDays={setWorkshopDays}
										until={until}
										setUntil={setUntil}
										dateRange={{ start: dateRange.start ?? undefined, end: dateRange.end ?? undefined }}
										setDateRange={setDateRange}
										every={every}
										setEvery={setEvery}
										setType={setType}
									/>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" className="rounded-2xl" onPress={onClose}>
								Cancelar
							</Button>
							<Button color="primary" className="rounded-2xl" onPress={handleSave} isLoading={isSaving}>
								Guardar cambios
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
