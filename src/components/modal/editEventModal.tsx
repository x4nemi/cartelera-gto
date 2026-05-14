import { PostData, updatePost } from "@/config/apiClient";
import { ImageGallery } from "@/components/image/imageGallery";
import {
	addToast,
	Button,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";

interface EditEventModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	postData: PostData;
	onUpdated?: (updatedPost: PostData) => void;
}

export const EditEventModal = ({ isOpen, onOpenChange, postData, onUpdated }: EditEventModalProps) => {
	const [caption, setCaption] = useState(postData.caption || "");
	const [title, setTitle] = useState(postData.title || "");
	const [summary, setSummary] = useState(postData.summary || "");
	const [location, setLocation] = useState(postData.location || "");
	const [price, setPrice] = useState(postData.price || "");
	const [tags, setTags] = useState<string[]>(postData.tags || []);
	const [tagInput, setTagInput] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// Re-seed inputs every time the modal opens so we always show the latest postData values.
	useEffect(() => {
		if (!isOpen) return;
		setCaption(postData.caption || "");
		setTitle(postData.title || "");
		setSummary(postData.summary || "");
		setLocation(postData.location || "");
		setPrice(postData.price || "");
		setTags(postData.tags || []);
		setTagInput("");
	}, [isOpen, postData]);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const updatedPostData: PostData = {
				...postData,
				caption,
				title: title.trim() || undefined,
				summary: summary.trim() || undefined,
				location: location.trim() || undefined,
				price: price.trim() || undefined,
				tags: tags.length > 0 ? tags : undefined,
			};

			const result = await updatePost(updatedPostData);
			addToast({
				title: "Evento actualizado",
				description: "Los cambios se han guardado correctamente.",
				color: "success",
				timeout: 5000,
				variant: "flat",
			});
			onUpdated?.(result);
			onOpenChange(false);
		} catch {
			addToast({
				title: "Error al guardar",
				description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
				color: "danger",
				timeout: 5000,
				variant: "flat",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const images = postData.images?.map((url) => ({ src: url })) ||
		(postData.images?.[0] ? [{ src: postData.images[0] }] : []);

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="4xl" scrollBehavior="inside" className="rounded-3xl">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">Editar evento</ModalHeader>
						<ModalBody>
							<div className="flex flex-col md:flex-row gap-4">
								{/* Left: Images */}
								{images.length > 0 && (
									<div className="md:w-1/2 shrink-0">
										<p className="text-small text-foreground-700 mb-2">Imágenes</p>
										<ImageGallery images={images} />
									</div>
								)}

								{/* Right: Caption + Dates */}
								<div className="flex flex-col gap-3 flex-1 min-w-0">
									<Input
										label="Título"
										labelPlacement="outside"
										placeholder="Nombre del evento"
										value={title}
										onValueChange={setTitle}
										variant="bordered"
									/>
									<Textarea
										label="Resumen"
										labelPlacement="outside"
										placeholder="Resumen breve del evento"
										value={summary}
										onValueChange={setSummary}
										variant="bordered"
										minRows={2}
									/>
									<div className="grid grid-cols-2 gap-3">
										<Input
											label="Lugar"
											labelPlacement="outside"
											placeholder="Ej. Teatro Juárez"
											value={location}
											onValueChange={setLocation}
											variant="bordered"
										/>
										<Input
											label="Costo"
											labelPlacement="outside"
											placeholder="Ej. $150 o Gratis"
											value={price}
											onValueChange={setPrice}
											variant="bordered"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-small">Etiquetas</label>
										<div className="flex flex-wrap gap-1">
											{tags.map((t) => (
												<Chip
													key={t}
													variant="flat"
													color="primary"
													size="sm"
													className="rounded-xl"
													onClose={() => setTags(tags.filter((x) => x !== t))}
												>
													#{t}
												</Chip>
											))}
										</div>
										<div className="flex gap-2">
											<Input
												placeholder="Agregar etiqueta"
												value={tagInput}
												onValueChange={setTagInput}
												variant="bordered"
												size="sm"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														const v = tagInput.trim().toLowerCase();
														if (v && !tags.includes(v) && tags.length < 5) setTags([...tags, v]);
														setTagInput("");
													}
												}}
											/>
											<Button
												size="sm"
												variant="flat"
												className="rounded-xl"
												onPress={() => {
													const v = tagInput.trim().toLowerCase();
													if (v && !tags.includes(v) && tags.length < 5) setTags([...tags, v]);
													setTagInput("");
												}}
											>
												Agregar
											</Button>
										</div>
									</div>
									<Textarea
										label="Descripción"
										labelPlacement="outside"
										placeholder="Describe tu evento aquí"
										value={caption}
										onValueChange={setCaption}
										variant="bordered"
										className="w-full"
									/>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" className="rounded-2xl" onPress={onClose}>
								Cancelar
							</Button>
							<Button color="primary" className="rounded-2xl" onPress={handleSave} isLoading={isSaving}>
								Guardar cambios
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
