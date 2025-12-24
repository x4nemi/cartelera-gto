import { FileUploadButton } from "@/components/fileUploadButton";
import { ImageItem } from "@/components/imageItem";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem, Button, Card, CardBody, cn, Input, Link, User } from "@heroui/react";
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

	const IgInputRef = useRef<HTMLInputElement>(null);

	const handleValidatingLink = async (inputLink: string) => {
		setLoading(true);
		setIsValidateButtonClicked(true);
		// Simular validación con timeout
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Aquí iría la lógica real de validación
		const isValid = inputLink.startsWith("https://www.instagram.com/p/");

		setIsLinkValid(isValid);
		setLoading(false);

		if (!isValid) {
			IgInputRef.current?.focus();
		}

	};
	//#endregion

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<div className="flex flex-col w-full max-w-2xl px-2">
					<h1 className={title({ class: "mb-4" })}>Publica un evento</h1>
					<Card className="w-full rounded-3xl focus:ring-0" shadow="lg">
						<CardBody className="px-1">
							<Accordion
								showDivider={false}
								selectionMode="single"
								hideIndicator
								selectedKeys={selectedKey ? [selectedKey] : []}
								onSelectionChange={(keys) => {
									const key = Array.from(keys)[0] as string;
									setSelectedKey(key === selectedKey ? key : key);
								}}
								itemClasses={{
									base: "mb-2 w-full",
									title: "font-bold text-lg",
									subtitle: "text-default-400 font-medium",
									trigger: cn(
										"p-4 bg-content1 hover:bg-content2 border-2 border-transparent rounded-2xl hover:border-secondary/30",
										"data-[open=true]:border-secondary/30 data-[open=true]:rounded-b-none data-[open=true]:bg-gray",
										"flex items-center justify-between gap-4 duration-250 transition-all data-[open=true]:bg-foreground/5 "
									),
									content: "px-4 py-4 bg-gray border-2 border-t-0 border-secondary/30 rounded-b-2xl"
								}}
							>
								<AccordionItem
									key="1"
									aria-label="Free"
									title={
										<div className="flex items-center justify-between w-full px-1">
											<div className="flex flex-col items-start">
												<span className="font-bold text-lg">Con un link de Instagram</span>
												<span className="text-default-400 font-medium text-sm">Publica un evento usando un link de Instagram</span>
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
												variant="bordered"
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
										{isValidateButtonClicked && isLinkValid && (
											<p className="text-xs text-success">Link válido</p>
										)}

										<div className="mt-2 flex flex-col rounded-xl p-3">
											<div className="justify-between flex mb-2">
												<User
													avatarProps={{
														src: ""
													}}
													description={
														<Link isExternal href="https://x.com/jrgarciadev" size="sm">
															@jrgarciadev
														</Link>
													}
													name="Junior Garcia"
												/>
												<p className="text-sm font-medium text-foreground/40">Publicación encontrada</p>
											</div>
											<div className="gap-2 flex flex-col">

												
												<ImageItem />
											</div>
										</div>
									</div>
								</AccordionItem>
								<AccordionItem
									key="2"
									aria-label="Pro"
									title={
										<div className="flex items-center justify-between w-full px-1">
											<div className="flex flex-col items-start">
												<span className="font-bold text-lg">Desde cero</span>
												<span className="text-default-400 font-medium text-sm">Sube las imágenes y detalles de tu evento</span>
											</div>
											<RadioCircle isSelected={selectedKey === "2"} />
										</div>
									}
								>
									<FileUploadButton />
								</AccordionItem>
							</Accordion>
						</CardBody>
					</Card>
				</div>
			</section>
		</DefaultLayout>
	);
}
