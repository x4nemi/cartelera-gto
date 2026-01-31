import { FileUploadButton } from "@/components/fileUploadButton";
import { ImageGallery } from "@/components/imageGallery";
import { title } from "@/components/primitives";
import { createPost, PostData } from '@/config/apiClient';
import CustomRadioGroup from "@/components/radioGroup";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, addToast, Alert, Button, Calendar, calendar, Card, CardBody, cn, Input, Link, Tab, Tabs, Textarea, TimeInput, User } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { CalendarIcon, EventIcon, LoopIcon } from "@/components/icons";

let tabs = [
	{
		label: "Evento",
		icon: <EventIcon size={26} color="bg-secondary" />,
		content: "Es un evento o un taller",
		calendar: <Calendar aria-label="Date (Visible Month)" visibleMonths={2} />
	},
	{
		label: "Taller / Curso",
		icon: <LoopIcon size={26} color="bg-secondary" />,
		content: "Es un evento recurrente",
	},
	{
		label: "Calendario",
		icon: <CalendarIcon size={26} color="bg-secondary" />,
		content: "Contiene varios eventos",
	},
];

export default function PublishPage() {

	//#region Radio selection
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	//#endregion

	//#region Instagram
	const [link, setLink] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [isLinkValid, setIsLinkValid] = useState<boolean>();
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
		} catch (error) {
			console.error("Error fetching post data:", error);
			setIsLinkValid(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Load draft post data from localStorage if available
		const draftData = localStorage.getItem("draftPostData");
		if (draftData) {
			setPostData(JSON.parse(draftData));
			setIsLinkValid(true);
			setSelectedKey(JSON.parse(draftData).selectedKey || null);
			setLink(JSON.parse(draftData).postLink || "");
		}
	}, []);

	//#endregion

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 -mt-10">
				<div className="flex flex-col w-full max-w-3xl px-2">
					<h1 className={title({ class: "mb-4 flex items-center gap-2 text-3xl" })}>
						<span className="relative flex size-3">
							<span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isLinkValid ? "bg-amber-400" : "bg-sky-400"}`}></span>
							<span className={`relative inline-flex size-3 rounded-full ${isLinkValid ? "bg-amber-500" : "bg-sky-500"}`}></span>
						</span>
						Crea tu publicación</h1>
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
							style={{ paddingLeft: 0, paddingRight: 0 }}
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
											<p className="text-sm font-medium text-foreground my-2 mt-3">Tipo de publicación</p>
											{/* <CustomRadioGroup /> */}
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
									</div>
								}
								className="mb-0"
							>
								<FileUploadButton />
							</AccordionItem>
						</Accordion>
					</div>
					{isLinkValid &&
						<>
							<h3 className="font-medium text-foreground mt-4 mb-2 text-lg">¿Qué tipo de publicación deseas hacer?</h3>

							<Tabs title="Elige los días del evento" variant="bordered"  isVertical color="secondary" size="lg">
								{tabs.map((tab, index) => (
									<Tab
										key={index}
										title={tab.label}
									>
										<Card>
											<CardBody>
												<Alert variant="faded" description={tab.content} hideIconWrapper color="primary" className="p-0 text-center" classNames={{iconWrapper:"-mr-2"}} icon={tab.icon}/>
												{tab.calendar && (<div className="mt-2 px-2">
													<p className="text-sm font-medium text-foreground mt-1">Elige los días del evento</p>
													{tab.calendar}
												</div>
												)}
												<TimeInput label="Event Time" />
											</CardBody>
										</Card>
									</Tab>
								))}
							</Tabs>
						</>
					}
				</div>
			</section>
		</DefaultLayout>
	);
}
