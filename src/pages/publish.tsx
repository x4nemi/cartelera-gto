import { DatesWidget } from "@/components/draft/datesWidget";
import { FileUploadButton } from "@/components/fileUploadButton";
import { IgIcon, ImagesIcon } from "@/components/icons";
import { ImageGallery } from "@/components/imageGallery";
import { title } from "@/components/primitives";
import { createPost, PostData, updatePost } from '@/config/apiClient';
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, addToast, Button, Card, cn, DateValue, Input, Link, Textarea, User } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

export default function PublishPage() {
	//#region Radio selection
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	//#endregion

	//#region Instagram
	const [link, setLink] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
	const [isValidateButtonClicked, setIsValidateButtonClicked] = useState(false);
	const [postData, setPostData] = useState<PostData | null>(null);

	const IgInputRef = useRef<HTMLInputElement>(null);

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

				const draftData = { ...eventData, selectedKey };
				localStorage.setItem("draftPostData", JSON.stringify(draftData));
			} else {
				setIsLinkValid(false);
			}
		} catch {
			setIsLinkValid(false);
		} finally {
			setLoading(false);
		}
	};

	const handlePublishPost = async () => {
		if (!postData) return;

		try {
			const postDataToPublish = {
				...postData,
				isDraft: false,
				dates: selectedDates,
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

				// Clear draft data from localStorage
				localStorage.removeItem("draftPostData");
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
		}
	}

	useEffect(() => {
		// Load draft post data from localStorage if available
		const draftData = localStorage.getItem("draftPostData");
		if (draftData) {
			setPostData(JSON.parse(draftData));
			setIsLinkValid(true);
			setSelectedKey(JSON.parse(draftData).selectedKey || null);
			setLink(JSON.parse(draftData).url || "");
		}
	}, []);

	//#endregion

	//#region selected dates
	const [selectedDates, setSelectedDates] = useState<DateValue[]>([]);
	//#endregion

	return (
		<DefaultLayout>
			<section className={`flex flex-col justify-center gap-4 flex-grow max-w-3xl md:mx-auto w-full px-2" + ${selectedKey !== null ? " mt-10" : " mt-20"} mx-4`}>
				<h1 className="text-3xl font-bold flex items-center gap-2 text-foreground md:text-4xl lg:text-5xl">
					<span className="relative flex size-3">
						<span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isLinkValid ? "bg-amber-400" : "bg-sky-400"}`}></span>
						<span className={`relative inline-flex size-3 rounded-full ${isLinkValid ? "bg-amber-500" : "bg-sky-500"}`}></span>
					</span>
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
							startContent={<IgIcon size={26} />}
							classNames={{base:"backdrop-blur-sm mb-2 "}}
						>
							<div className="flex flex-col gap-2">
								<label htmlFor="instagram-link" className="text-sm font-medium text-foreground">Link de la publicación</label>
								<div className="flex">
									<Input
										id="instagram-link"
										placeholder="https://www.instagram.com/p/..."
										value={link}
										onChange={(e) => setLink(e.target.value)}
										classNames={{
											input: "text-sm",
											inputWrapper: `h-12 ${!isLinkValid ? "rounded-r-none text-default-400" : ""}`,
										}}
										isClearable={!isLinkValid}
										onClear={() => { setIsValidateButtonClicked(false); setLink("") }}
										ref={IgInputRef}
										readOnly={isLinkValid}
									/>
									{!isLinkValid && <Button
										color="primary"
										variant="flat"
										isLoading={loading}
										isDisabled={link.length === 0}
										onPress={() => handleValidatingLink(link)}
										className="min-w-24 h-12 rounded-l-none"
									>
										Validar
									</Button>}
								</div>
								{isValidateButtonClicked && link.length > 0 && !loading && !isLinkValid && (
									<p className="text-xs text-danger">Link inválido. Inténtalo de nuevo.</p>
								)}

								{isLinkValid && (
									<div className="mt-2 flex flex-col rounded-xl ">
										<p className="text-sm font-medium text-foreground-500 mb-2">Publicación encontrada</p>

										<Card className="flex flex-col justify-start mb-2 bg-content2 p-4 gap-2" shadow="none">
											<p className="text-small text-foreground-700  mb-2">Usuario</p>
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
											<Textarea className="w-full mt-3" label="Descripción" placeholder="Describe tu evento aquí" value={postData?.caption || ""} labelPlacement="outside" variant="bordered" />

											<p className="text-small text-foreground-700 mt-3 mb-1">Imágenes</p>
											<div className="gap-2 flex flex-col">
												<ImageGallery images={postData?.images?.map(url => ({ src: url })) || (postData?.displayUrl ? [{ src: postData.displayUrl }] : [])} />
											</div>
										</Card>
										<DatesWidget selectedDays={selectedDates} onChange={setSelectedDates} />
									</div>
								)}
							</div>
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
							startContent={<ImagesIcon size={26} />}
						>
							<FileUploadButton />
						</AccordionItem>
					</Accordion>
					{selectedDates.length > 0 && <div className="flex w-full justify-end gap-2 mt-3">
						<Button size="lg" color="danger" variant="bordered">Cancelar</Button>
						<Button className="" size="lg" color="primary" variant="solid" onPress={handlePublishPost}>Crear evento</Button>
					</div>}
				</div>
			</section>
		</DefaultLayout>
	);
}
