import { FileUploadButton } from "@/components/fileUploadButton";
import { ImageGallery } from "@/components/imageGallery";
import { title } from "@/components/primitives";
import { createPost, PostData } from '@/config/apiClient';
import CustomRadioGroup from "@/components/radioGroup";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, addToast, Button, cn, Input, Link, Textarea, User } from "@heroui/react";
import { useRef, useState } from "react";

export default function PublishPage() {

	//#region Radio selection
	const [selectedKey, setSelectedKey] = useState<string | null>(null);

	const RadioCircle = ({ isSelected }: { isSelected: boolean }) => (
		<div className={cn(
			"w-5 h-5 rounded-full border-2 flex items-center justify-center",
			isSelected ? "border-secondary" : "border-default-300"
		)}>
			<div className={cn(
				"w-2.5 h-2.5 rounded-full transition-colors",
				isSelected ? "bg-secondary" : "bg-transparent"
			)} />
		</div>
	);
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
			} else {
				setIsLinkValid(false);
			}
		} catch (error) {
			console.error("Error fetching post data:", error);
			setIsLinkValid(false);
		} finally {
			setLoading(false);
		}
	};

	//#endregion

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 -mt-10">
				<div className="flex flex-col w-full max-w-3xl px-2">
					<h1 className={title({ class: "mb-4 flex items-center gap-2 text-3xl" })}>
						<span className="relative flex size-3">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
							<span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
						</span>
						Crea tu publicación</h1>
					<CustomRadioGroup />
					<h3 className="font-medium text-foreground mt-6 mb-2 text-lg">¿Cómo deseas publicarlo?</h3>
					<div className="w-full" >
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
							style={{paddingLeft:0, paddingRight:0}}
							itemClasses={{
								base: "mb-2",
								trigger: cn(
									"p-4 bg-content1 hover:bg-content2 border-2 border-default rounded-2xl hover:border-default-400",
									"data-[open=true]:border-secondary data-[open=true]:rounded-b-none data-[open=true]:bg-gray",
									"flex items-center justify-between gap-4 duration-250 transition-all data-[open=true]:bg-violet-100 data-[open=true]:dark:bg-violet-800/20"
								),
								content: "px-4 py-4 bg-gray border-2 border-t-0 border-secondary rounded-b-2xl"
							}}
						>
							<AccordionItem
								key="1"
								aria-label="Free"
								title={
									<div className="flex items-center justify-between w-full">
										<div className="flex flex-col items-start">
											<span className="font-bold text-md">Con un link de Instagram</span>
											<span className="text-default-400 font-medium text-sm italic">Extrae las imágenes y detalles de tu evento</span>
										</div>
										<RadioCircle isSelected={selectedKey === "1"} />
									</div>
								}
							>
								<div className="flex flex-col gap-2">
									<label htmlFor="instagram-link" className="text-sm font-medium text-foreground">Link de la publicación</label>
									<div className="flex">
										<Input
											id="instagram-link"
											placeholder="https://www.instagram.com/p/..."
											// variant="bordered"
											value={link}
											onChange={(e) => setLink(e.target.value)}
											classNames={{
												input: "text-sm",
												inputWrapper: "h-12 rounded-r-none text-default-400",
											}}
											onClear={() => { setIsValidateButtonClicked(false); setLink("") }}
											ref={IgInputRef}
										/>
										<Button
											color="secondary"
											variant="flat"
											isLoading={loading}
											isDisabled={link.length === 0}
											onPress={() => handleValidatingLink(link)}
											className="min-w-24 h-12 rounded-l-none"
										>
											Validar
										</Button>
									</div>
									{isValidateButtonClicked && link.length > 0 && !loading && !isLinkValid && (
										<p className="text-xs text-danger">Link inválido. Inténtalo de nuevo.</p>
									)}

									{isLinkValid && (
										<div className="mt-2 flex flex-col rounded-xl p-3">
											<div className="justify-between flex mb-2">
												<User
													avatarProps={{
														src: postData?.ownerProfilePicUrl || "",
													}}
													description={
														<Link isExternal href={"https://www.instagram.com/" + postData?.ownerUsername} size="sm">
															@{postData?.ownerUsername}
														</Link>
													}
													name={postData?.ownerFullName || ""}
												/>
												<p className="text-sm font-medium text-foreground/40">Publicación encontrada</p>
											</div>
											<div className="gap-2 flex flex-col">
												<ImageGallery images={postData?.images?.map(url => ({ src: url })) || (postData?.displayUrl ? [{ src: postData.displayUrl }] : [])} />
											</div>
											<Textarea className="w-full mt-3" label="Descripción" placeholder="Describe tu evento aquí" value={postData?.caption || ""} />
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
											<span className="text-default-400 font-medium text-sm italic">Sube tus propias imágenes y detalles</span>
										</div>
										<RadioCircle isSelected={selectedKey === "2"} />
									</div>
								}
								className="mb-0"
							>
								<FileUploadButton />
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
