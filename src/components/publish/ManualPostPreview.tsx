import { EventDates } from "@/components/dates/tabs";
import { Card, DateValue, Image, Input, Textarea } from "@heroui/react";
import { useRef, useState } from "react";

interface ManualPostPreviewProps {
	images: File[];
	setImages: (files: File[]) => void;
	caption: string;
	setCaption: (caption: string) => void;
	ownerName: string;
	selectedDates: DateValue[];
	setSelectedDates: (dates: DateValue[]) => void;
	workshopDays: string[];
	setWorkshopDays: (days: string[]) => void;
	until: DateValue | null;
	setUntil: (date: DateValue | null) => void;
	dateRange: { start: DateValue | null; end: DateValue | null };
	setDateRange: (range: { start: DateValue | null; end: DateValue | null }) => void;
	every: number;
	setEvery: (num: number) => void;
	setType: (type: "event" | "workshop" | "calendar" | "draft") => void;
}

export const ManualPostPreview = ({
	images,
	setImages,
	caption,
	setCaption,
	ownerName,
	selectedDates,
	setSelectedDates,
	workshopDays,
	setWorkshopDays,
	until,
	setUntil,
	dateRange,
	setDateRange,
	every,
	setEvery,
	setType,
}: ManualPostPreviewProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previews, setPreviews] = useState<string[]>([]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		const newFiles = [...images, ...files];
		setImages(newFiles);

		const newPreviews = files.map((file) => URL.createObjectURL(file));
		setPreviews((prev) => [...prev, ...newPreviews]);
	};

	const removeImage = (index: number) => {
		const newFiles = images.filter((_, i) => i !== index);
		setImages(newFiles);

		URL.revokeObjectURL(previews[index]);
		const newPreviews = previews.filter((_, i) => i !== index);
		setPreviews(newPreviews);
	};

	return (
		<div className="mt-2 flex flex-col rounded-xl">
			<Card className="flex flex-col justify-start mb-2 bg-content2 p-4 gap-2" shadow="none">
				<Input
					label="Nombre del organizador"
					value={ownerName}
					isReadOnly
					labelPlacement="outside"
					variant="bordered"
					className="mb-2"
				/>

				<Textarea
					className="w-full"
					label="Descripción"
					placeholder="Describe tu evento aquí"
					value={caption}
					onValueChange={setCaption}
					labelPlacement="outside"
					variant="bordered"
				/>

				<p className="text-small text-foreground-700 mt-3 mb-1">Imágenes</p>

				{previews.length > 0 && (
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mb-2">
						{previews.map((src, index) => (
							<div key={index} className="relative group">
								<Image
									src={src}
									alt={`Imagen ${index + 1}`}
									className="w-full h-32 object-cover rounded-xl"
									removeWrapper
								/>
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="absolute top-1 right-1 z-10 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
								>
									✕
								</button>
							</div>
						))}
					</div>
				)}

				<div
					className="flex justify-center rounded-xl border border-dashed border-foreground/30 px-6 py-8 cursor-pointer hover:border-primary/50 transition-colors"
					role="button"
					tabIndex={0}
					onClick={() => fileInputRef.current?.click()}
					onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
				>
					<div className="text-center">
						<p className="text-sm text-default-500">
							<span className="font-semibold text-primary">Elegir archivos</span> o arrastra y suelta
						</p>
						<p className="text-xs text-default-400 mt-1">PNG, JPG, GIF hasta 10MB</p>
					</div>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						className="sr-only"
						onChange={handleFileChange}
					/>
				</div>
			</Card>

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
	);
};
