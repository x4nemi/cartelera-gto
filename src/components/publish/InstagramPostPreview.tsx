import { SmartDatePicker } from "@/components/dates/smartDatePicker";
import { ImageGallery } from "@/components/image/imageGallery";
import { PostData } from "@/config/apiClient";
import { Card, Link, Textarea, User } from "@heroui/react";

interface InstagramPostPreviewProps {
	postData: PostData | null;
	selectedDates: Date[];
	onDatesChange: (dates: Date[]) => void;
}

export const InstagramPostPreview = ({
	postData,
	selectedDates,
	onDatesChange,
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
			<SmartDatePicker
				selectedDates={selectedDates}
				onChange={onDatesChange}
				caption={postData?.caption}
				imageUrls={postData?.images}
			/>
		</div>
	);
};
