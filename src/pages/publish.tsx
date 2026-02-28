import { ArrowLeftIcon, IGFilledIcon, IgIcon, ImagesFilledIcon, ImagesIcon } from "@/components/icons";
import { CancelModal } from "@/components/modal/cancelModal";
import { InstagramLinkInput, InstagramPostPreview, ManualPostPreview, PublishActions } from "@/components/publish";
import { AzureStorageAPI, createPost, CosmosAPI, PostData, updatePost } from '@/config/apiClient';
import { useRequireUser } from "@/hooks/useRequireUser";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, addToast, Button, cn, DateValue, Spinner } from "@heroui/react";
import { getLocalTimeZone } from "@internationalized/date";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PublishPage() {
	const { username } = useParams<{ username: string }>();
	const { loading: loadingUser } = useRequireUser(username);

	//#region Selected dates
	const [selectedDates, setSelectedDates] = useState<DateValue[]>([]);
	const [workshopDays, setWorkshopDays] = useState<string[]>([]);
	const [every, setEvery] = useState<number>(1);
	const [until, setUntil] = useState<DateValue | null>(null);
	const [dateRange, setDateRange] = useState<{ start: DateValue | null, end: DateValue | null }>({ start: null, end: null });

	const [type, setType] = useState<"event" | "workshop" | "calendar" | "draft">("event");

	//#region Manual post
	const [manualImages, setManualImages] = useState<File[]>([]);
	const [manualCaption, setManualCaption] = useState("");
	const manualOwnerName = username ?? "";
	//#endregion

	let hasSelectedDates = selectedDates.length > 0 || (workshopDays.length > 0 && until !== null && every > 0) || (dateRange.start !== null && dateRange.end !== null);
	const canPublishManual = hasSelectedDates && manualImages.length > 0 && manualOwnerName.trim().length > 0;

	/**
	 * Converts all date selections into a flat sorted list of ISO date strings.
	 * - Event: uses the directly selected DateValue[]
	 * - Workshop: expands recurring weekdays (every N weeks) until the end date
	 * - Calendar: expands the date range into every day between start and end
	 */
	const computeFlatDates = (): string[] => {
		const tz = getLocalTimeZone();

		if (type === "event") {
			return selectedDates
				.map(d => d.toDate(tz).toISOString().split("T")[0])
				.sort();
		}

		if (type === "workshop" && workshopDays.length > 0 && until) {
			// workshopDays are indices like "0"=Lunes, "1"=Martes, etc.
			// Map to JS weekday: Lunes=1, Martes=2, ..., Domingo=0
			const dayMap: Record<string, number> = { "0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 0 };
			const targetDays = workshopDays.map(d => dayMap[d]);
			const endDate = until.toDate(tz);
			const dates: string[] = [];
			const cursor = new Date();
			cursor.setHours(0, 0, 0, 0);

			while (cursor <= endDate) {
				if (targetDays.includes(cursor.getDay())) {
					dates.push(cursor.toISOString().split("T")[0]);
				}
				cursor.setDate(cursor.getDate() + 1);
			}

			// If every > 1, keep only every Nth occurrence per weekday
			if (every > 1) {
				const countPerDay: Record<number, number> = {};
				return dates.filter(dateStr => {
					const day = new Date(dateStr).getDay();
					countPerDay[day] = (countPerDay[day] || 0) + 1;
					return (countPerDay[day] - 1) % every === 0;
				});
			}

			return dates;
		}

		if (type === "calendar" && dateRange.start && dateRange.end) {
			const start = dateRange.start.toDate(tz);
			const end = dateRange.end.toDate(tz);
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
	//#endregion
	
	//#region Radio selection
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	const [openCancelModal, setOpenCancelModal] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	const handleCancel = () => {
		setOpenCancelModal(false);
		setSelectedKey(null);
		setLink("");
		setIsLinkValid(false);
		setPostData(null);
		setSelectedDates([]);
		setWorkshopDays([]);
		setUntil(null);
		setDateRange({ start: null, end: null });
		setManualImages([]);
		setManualCaption("");
	}

	//#endregion

	//#region Instagram
	const [link, setLink] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
	const [isValidateButtonClicked, setIsValidateButtonClicked] = useState(false);
	const [postData, setPostData] = useState<PostData | null>(null);

	const IgInputRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const handleValidatingLink = async (inputLink: string) => {
		setLoading(true);
		setIsValidateButtonClicked(true);

		// Validate URL format
		const isValid = inputLink.startsWith("https://www.instagram.com/p/");

		if (!isValid) {
			setIsLinkValid(false);
			setLoading(false);
			IgInputRef.current?.focus();
			return;
		}

		try {
			const eventData = await createPost(inputLink);

			if (eventData) {
				setPostData(eventData);
				setIsLinkValid(true);
				addToast({
					title: "Link válido",
					description: "Se han extraído los datos de la publicación.",
					color: "success",
					timeout: 8000,
					variant: "flat"
				})
			} else {
				setIsLinkValid(false);
			}
		} catch {
			setIsLinkValid(false);
		} finally {
			setLoading(false);
		}
	};

	const handlePublishManual = async () => {
		if (manualImages.length === 0 || !manualOwnerName.trim()) return;

		setIsPublishing(true);

		try {
			const imageUrls = await AzureStorageAPI.uploadMultipleFiles(manualImages);
			const dates = computeFlatDates();
			const shortCode = `manual-${Date.now()}`;

			const manualPost: PostData = {
				shortCode,
				caption: manualCaption,
				displayUrl: imageUrls[0],
				images: imageUrls,
				ownerUsername: manualOwnerName.trim().toLowerCase().replace(/\s+/g, "_"),
				ownerFullName: manualOwnerName.trim(),
				ownerProfilePicUrl: "",
				isDraft: false,
				type: type,
				dates: dates.length > 0 ? dates : null,
			};

			const result = await CosmosAPI.insertEvent(manualPost);

			if (result.success) {
				addToast({
					title: "Publicación exitosa",
					description: "Tu evento ha sido publicado correctamente.",
					color: "success",
					timeout: 8000,
					variant: "flat"
				});
				navigate(`/completado/${shortCode}`);
			} else {
				addToast({
					title: "Error al publicar",
					description: "Hubo un problema al publicar tu evento.",
					color: "danger",
					timeout: 8000,
					variant: "flat"
				});
			}
		} catch (error) {
			console.error("Error publishing manual post:", error);
			addToast({
				title: "Error al publicar",
				description: "Hubo un problema al subir las imágenes.",
				color: "danger",
				timeout: 8000,
				variant: "flat"
			});
		} finally {
			setIsPublishing(false);
		}
	}

	const handlePublishPost = async () => {
		if (!postData) return;

		setIsPublishing(true);

		try {
			const dates = computeFlatDates();
			
			const postDataToPublish = {
				...postData,
				isDraft: false,
				type: type,
				dates: dates.length > 0 ? dates : null
			};

			const publishedPost = await updatePost(postDataToPublish);

			if (publishedPost) {
				addToast({
					title: "Publicación exitosa",
					description: "Tu evento ha sido publicado correctamente.",
					color: "success",
					timeout: 8000,
					variant: "flat"
				});
				setIsPublishing(false);
				navigate(`/completado/${publishedPost.shortCode}`);
			} else {
				addToast({
					title: "Error al publicar",
					description: "Hubo un problema al publicar tu evento. Inténtalo de nuevo.",
					color: "danger",
					timeout: 8000,
					variant: "flat"
				});
			}

		} catch (error) {
			console.error("Error publishing post:", error);
		} finally {
			setIsPublishing(false);
		}
	}
	//#endregion


	return (
		<DefaultLayout>
			{loadingUser ? (
				<section className="flex flex-col items-center justify-center flex-grow w-full py-20">
					<Spinner size="lg" color="primary" />
				</section>
			) : (
			<section className={`flex flex-col  gap-4 flex-grow max-w-3xl md:mx-auto w-full px-2 justify-center`}>
				<Button variant="flat" color="primary" onPress={() => navigate(`/${username}`)} className="self-start">
					<ArrowLeftIcon size={24} />
					Volver al portal
				</Button>
				<h1 className="text-3xl font-bold flex items-center gap-2 text-foreground md:text-4xl lg:text-5xl">
					Crea tu publicación</h1>
				<h3 className="font-semibold text-foreground text-lg">¿Cómo deseas publicarlo?</h3>
				<div className="w-full">
					<Accordion
						showDivider={false}
						selectionMode="single"
						hideIndicator
						as={"div"}
						selectedKeys={selectedKey ? [selectedKey] : []}
						onSelectionChange={(keys) => {
							const key = Array.from(keys)[0] as string;
							setSelectedKey(key === selectedKey ? key : key);
						}}
						style={{ paddingLeft: 0, paddingRight: 0 }}
						itemClasses={{
							base: "mb-2",
							trigger: cn(
								"p-4 bg-content2/70 rounded-2xl hover:bg-primary-200/70",
								"data-[open=true]:rounded-b-none data-[open=true]:bg-primary-200/70 data-[open=true]:border-primary-300",
								"flex items-center justify-between gap-4 duration-250 transition-all backdrop-blur-md"
							),
							content: "px-4 py-4 bg-gray border-t-0 rounded-b-2xl bg-content2/70 backdrop-blur-md",
						}}
					>
						<AccordionItem
							key="1"
							aria-label="Free"
							title={
								<div className="flex items-center justify-between w-full">
									<div className="flex flex-col items-start">
										<span className="font-bold text-md">Con un link de Instagram</span>
										<span className="text-default-600 font-medium text-sm italic">Extrae las imágenes y detalles de tu evento. Tu cuenta debe ser pública.</span>
									</div>
								</div>
							}
							startContent={selectedKey === "1" ? <IGFilledIcon size={26} /> : <IgIcon size={26} />}
							classNames={{base:"backdrop-blur-sm mb-2 "}}
							onPress={() => {
								if (selectedKey === "1" && isLinkValid) {
									setSelectedKey("1");
								}
							}}
						>
							<InstagramLinkInput
								link={link}
								setLink={setLink}
								loading={loading}
								isLinkValid={isLinkValid}
								isValidateButtonClicked={isValidateButtonClicked}
								setIsValidateButtonClicked={setIsValidateButtonClicked}
								onValidate={handleValidatingLink}
								inputRef={IgInputRef}
							/>
							{isLinkValid && (
								<InstagramPostPreview
									postData={postData}
									selectedDates={selectedDates}
									setSelectedDates={setSelectedDates}
									workshopDays={workshopDays}
									setWorkshopDays={setWorkshopDays}
									until={until}
									setUntil={setUntil}
									dateRange={dateRange}
									setDateRange={setDateRange}
									every={every}
									setEvery={setEvery}
									setType={setType}
								/>
							)}
						</AccordionItem>
						<AccordionItem
							key="2"
							aria-label="Pro"
							title={
								<div className="flex items-center justify-between w-full">
									<div className="flex flex-col items-start ">
										<span className="font-bold text-md">Desde cero</span>
										<span className="text-default-700 font-medium text-sm italic">Sube tus propias imágenes y detalles.</span>
									</div>
								</div>
							}
							className="mb-0"
							startContent={selectedKey === "2" ? <ImagesFilledIcon size={26} /> : <ImagesIcon size={26} />}
							hidden={isLinkValid}
						>
							<ManualPostPreview
								images={manualImages}
								setImages={setManualImages}
								caption={manualCaption}
								setCaption={setManualCaption}
								ownerName={manualOwnerName}

								selectedDates={selectedDates}
								setSelectedDates={setSelectedDates}
								workshopDays={workshopDays}
								setWorkshopDays={setWorkshopDays}
								until={until}
								setUntil={setUntil}
								dateRange={dateRange}
								setDateRange={setDateRange}
								every={every}
								setEvery={setEvery}
								setType={setType}
							/>
						</AccordionItem>
					</Accordion>
					{selectedKey === "2" ? (
						canPublishManual ? (
							<PublishActions
								onCancel={() => setOpenCancelModal(true)}
								onPublish={handlePublishManual}
								isPublishing={isPublishing}
							/>
						) : manualImages.length > 0 ? (
							<p className="text-sm text-foreground-500 mt-2">
								{!manualOwnerName.trim() ? "Agrega el nombre del organizador." : "Selecciona las fechas de tu evento para habilitar el botón de publicar."}
							</p>
						) : null
					) : hasSelectedDates ? (
						<PublishActions
							onCancel={() => setOpenCancelModal(true)}
							onPublish={handlePublishPost}
							isPublishing={isPublishing}
						/>
					) : isLinkValid ? (
						<p className="text-sm text-foreground-500 mt-2">Selecciona las fechas de tu evento para habilitar el botón de publicar.</p>
					) : null
					}
				</div>
			</section>
			)}
			<CancelModal openModal={openCancelModal} setOpenModal={setOpenCancelModal} onCancel={handleCancel} />
		</DefaultLayout>
	);
}
