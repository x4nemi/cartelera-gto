import { SmartDatePicker } from "@/components/dates/smartDatePicker";
import { Avatar, Card, Image, Textarea } from "@/compat/heroui";
import { useRef, useState } from "react";
import { AISuggestionsPanel, AIFieldsValue, AIVerdict } from "./AISuggestionsPanel";
import type { AISuggestions } from "@/config/apiClient";

interface ManualPostPreviewProps {
	images: File[];
	setImages: (files: File[]) => void;
	caption: string;
	setCaption: (caption: string) => void;
	ownerName: string;
	selectedDates: Date[];
	onDatesChange: (dates: Date[]) => void;
	aiFields: AIFieldsValue;
	onAIFieldsChange: (next: AIFieldsValue) => void;
	onAISuggestions?: (s: AISuggestions | null) => void;
	onAIVerdict?: (v: AIVerdict | null) => void;
}

export const ManualPostPreview = ({
	images,
	setImages,
	caption,
	setCaption,
	ownerName,
	selectedDates,
	onDatesChange,
	aiFields,
	onAIFieldsChange,
	onAISuggestions,
	onAIVerdict,
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
		<div className="mt-2 flex flex-col rounded-xl gap-3">
			<Card className="flex flex-col bg-content2 p-4 gap-4" shadow="none">
				{/* Compact organizer header */}
				<div className="flex items-center gap-3">
					<Avatar size="sm" name={ownerName} />
					<div className="flex flex-col min-w-0">
						<span className="text-sm font-semibold text-foreground truncate">
							{ownerName || "Organizador"}
						</span>
						<span className="text-xs text-foreground-500">@{ownerName}</span>
					</div>
				</div>

				{/* Description | Images */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Textarea
						label="Descripción"
						placeholder="Describe tu evento aquí"
						value={caption}
						onValueChange={setCaption}
						labelPlacement="outside"
						variant="secondary"
						minRows={6}
						maxRows={12}
					/>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs text-foreground-700">Imágenes</label>

						{previews.length > 0 && (
							<div className="grid grid-cols-2 gap-2">
								{previews.map((src, index) => (
									<div key={index} className="relative group">
										<Image
											src={src}
											alt={`Imagen ${index + 1}`}
											className="w-full h-28 object-cover rounded-xl"
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
							className="flex justify-center rounded-xl border border-dashed border-foreground/30 px-6 py-6 cursor-pointer hover:border-primary/50 transition-colors"
							role="button"
							tabIndex={0}
							onClick={() => fileInputRef.current?.click()}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
							}}
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
					</div>
				</div>
			</Card>

			<AISuggestionsPanel
				caption={caption}
				value={aiFields}
				onChange={onAIFieldsChange}
				onSuggestions={onAISuggestions}
				onVerdict={onAIVerdict}
			/>

			<SmartDatePicker
				selectedDates={selectedDates}
				onChange={onDatesChange}
				caption={caption}
			/>
		</div>
	);
};
