import { EventDates } from "@/components/dates/tabs";
import { ImageGallery } from "@/components/image/imageGallery";
import { PostData } from "@/config/apiClient";
import { Card, DateValue, Link, Textarea, User } from "@heroui/react";

interface InstagramPostPreviewProps {
	postData: PostData | null;
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

export const InstagramPostPreview = ({
	postData,
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
}: InstagramPostPreviewProps) => {
	return (
		<div className="mt-2 flex flex-col rounded-xl">
			<p className="text-sm font-medium text-foreground-500 mb-2">Publicación encontrada</p>

			<Card className="flex flex-col justify-start mb-2 bg-content2 p-4 gap-2" shadow="none">
				<p className="text-small text-foreground-700 mb-2">Usuario</p>
				<User
					avatarProps={{
						src: postData?.ownerProfilePicUrl || "",
					}}
					description={
						<Link isExternal href={"https://www.instagram.com/" + postData?.ownerUsername} size="sm">
							@{postData?.ownerUsername}
						</Link>
					}
					className="self-start ml-3"
					name={postData?.ownerFullName || ""}
				/>
				<Textarea
					className="w-full mt-3"
					label="Descripción"
					placeholder="Describe tu evento aquí"
					value={postData?.caption || ""}
					labelPlacement="outside"
					variant="bordered"
				/>

				<p className="text-small text-foreground-700 mt-3 mb-1">Imágenes</p>
				<div className="gap-2 flex flex-col">
					<ImageGallery
						images={
							postData?.images?.map((url) => ({ src: url })) ||
							(postData?.displayUrl ? [{ src: postData.displayUrl }] : [])
						}
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
