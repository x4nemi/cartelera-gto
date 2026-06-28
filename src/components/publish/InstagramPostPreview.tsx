import { SmartDatePicker } from "@/components/dates/smartDatePicker";
import { ImageCarousel } from "@/components/image/imageCarousel";
import { AISuggestions, PostData } from "@/config/apiClient";
import { Link } from "@/compat/heroui";
import { Avatar, Card, Textarea } from "@/compat/heroui";
import { AISuggestionsPanel, AIFieldsValue, AIVerdict } from "./AISuggestionsPanel"
interface InstagramPostPreviewProps {
	postData: PostData | null;
	selectedDates: Date[];
	onDatesChange: (dates: Date[]) => void;
	aiFields: AIFieldsValue;
	onAIFieldsChange: (next: AIFieldsValue) => void;
	onAISuggestions?: (s: AISuggestions | null) => void;
	onAIVerdict?: (v: AIVerdict | null) => void;
}

export const InstagramPostPreview = ({
	postData,
	selectedDates,
	onDatesChange,
	aiFields,
	onAIFieldsChange,
	onAISuggestions,
	onAIVerdict,
}: InstagramPostPreviewProps) => {
	return (
		<div className="mt-2 flex flex-col rounded-xl gap-3">
			<Card className="flex flex-col bg-content2 p-4 gap-4" shadow="none">
				{/* Compact user header */}
				<div className="flex items-center gap-3">
					<Avatar
						size="sm"
						src={postData?.owner?.profilePicUrl || ""}
						name={postData?.owner?.fullName || postData?.ownerUsername || ""}
					/>
					<div className="flex flex-col min-w-0">
						<span className="text-sm font-semibold text-foreground truncate">
							{postData?.owner?.fullName || postData?.ownerUsername}
						</span>
						<Link
							isExternal
							size="sm"
							href={"https://www.instagram.com/" + postData?.ownerUsername}
							className="text-xs"
						>
							@{postData?.ownerUsername}
						</Link>
					</div>
				</div>

				{/* Description | Images — image renders at natural aspect ratio,
				    description is a scrollable textarea with a comfortable fixed height. */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Textarea
						label="Descripción"
						placeholder="Describe tu evento aquí"
						value={postData?.caption || ""}
						labelPlacement="outside"
						variant="secondary"
						minRows={12}
						maxRows={12}
						classNames={{
							input: "resize-none",
						}}
					/>
					<div className="flex flex-col gap-1.5">
						<label className="text-xs text-foreground-700">Imágenes</label>
						<ImageCarousel
							images={postData?.images || []}
							className="w-full h-auto rounded-xl object-contain bg-content3"
						/>
					</div>
				</div>
			</Card>

			<AISuggestionsPanel
				caption={postData?.caption}
				imageUrls={postData?.images}
				value={aiFields}
				onChange={onAIFieldsChange}
				onSuggestions={onAISuggestions}
				onVerdict={onAIVerdict}
			/>

			<SmartDatePicker
				selectedDates={selectedDates}
				onChange={onDatesChange}
				caption={postData?.caption}
				imageUrls={postData?.images}
			/>
		</div>
	);
};
