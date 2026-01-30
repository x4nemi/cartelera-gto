import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { randomEvents } from "@/config/site";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { ImageCarousel } from "@/components/imageCarousel";
import { ArrowLeftIcon } from "@/components/icons";

export default function EventDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const event = randomEvents.find(e => e.id === slug);

	if (!event) {
		return (
			<DefaultLayout>
				<section className="flex flex-col items-center justify-center gap-4 -mt-20">
					<div className="text-center max-w-lg">
						<h1 className="text-3xl font-bold mb-4">Evento no encontrado</h1>
						<p className="text-default-500 mb-6">El evento que buscas no existe o ha sido eliminado.</p>
						<Button color="primary" onPress={() => navigate("/")}>
							Volver al inicio
						</Button>
					</div>
				</section>
			</DefaultLayout>
		);
	}

	const eventDate = new Date(event.date);
	const formattedDate = eventDate.toLocaleDateString('es-MX', { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	});

	const postProperties = {
		event: {
			title: "Evento",
			color: "primary" as const
		},
		workshop: {
			title: "Taller / Curso",
			color: "secondary" as const
		},
		calendar: {
			title: "Calendario",
			color: "success" as const
		},
	};

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center -mt-14">
				<div className="container mx-auto max-w-4xl px-4">
					<Button
						startContent={<ArrowLeftIcon />}
						variant="light"
						onPress={() => navigate("/")}
						className="mb-4"
					>
						Volver
					</Button>

					<Card className="w-full flex md:flex-row">
						<CardHeader className="flex flex-col items-start gap-3 p-6">
							<div className="flex justify-between items-start w-full">
								<Chip 
									color={postProperties[event.type || "event"].color}
									variant="flat"
								>
									{postProperties[event.type || "event"].title}
								</Chip>
							</div>
							<h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
							<div className="flex flex-col gap-2 text-default-600">
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold">📅 Fecha:</span>
									<span className="text-sm capitalize">{formattedDate}</span>
								</div>
								{event.hour && (
									<div className="flex items-center gap-2">
										<span className="text-sm font-semibold">🕐 Hora:</span>
										<span className="text-sm">{event.hour}</span>
									</div>
								)}
								{event.isRecurrent && (
									<Chip color="warning" variant="flat" size="sm">
										Evento recurrente
									</Chip>
								)}
							</div>
						</CardHeader>

						<CardBody className="gap-6 p-6 pt-0">
							{event.image && (
								<div className="w-full">
									<ImageCarousel 
										images={[event.image]} 
										className="rounded-xl"
									/>
								</div>
							)}

							{event.description && (
								<div className="space-y-2">
									<h2 className="text-xl font-semibold">Descripción</h2>
									<p className="text-default-700 whitespace-pre-wrap">
										{event.description}
									</p>
								</div>
							)}

							{event.user && (
								<div className="space-y-3 border-t pt-6">
									<h2 className="text-xl font-semibold">Organizador</h2>
									<div className="flex items-center gap-3">
										{event.user.avatarUrl && (
											<img 
												src={event.user.avatarUrl} 
												alt={event.user.name}
												className="w-16 h-16 rounded-full object-cover"
											/>
										)}
										<div>
											<p className="font-semibold">{event.user.name}</p>
											<p className="text-sm text-default-500">@{event.user.username}</p>
											{event.user.location && (
												<p className="text-sm text-default-500">📍 {event.user.location}</p>
											)}
										</div>
									</div>
									{event.user.bio && (
										<p className="text-default-600">{event.user.bio}</p>
									)}
									{event.user.socialLinks && (
										<div className="flex gap-2 flex-wrap">
											{event.user.socialLinks.website && (
												<Button
													as="a"
													href={event.user.socialLinks.website}
													target="_blank"
													rel="noopener noreferrer"
													size="sm"
													variant="flat"
												>
													🌐 Sitio web
												</Button>
											)}
											{event.user.socialLinks.instagram && (
												<Button
													as="a"
													href={event.user.socialLinks.instagram}
													target="_blank"
													rel="noopener noreferrer"
													size="sm"
													variant="flat"
													color="secondary"
												>
													📷 Instagram
												</Button>
											)}
											{event.user.socialLinks.facebook && (
												<Button
													as="a"
													href={event.user.socialLinks.facebook}
													target="_blank"
													rel="noopener noreferrer"
													size="sm"
													variant="flat"
													color="primary"
												>
													👥 Facebook
												</Button>
											)}
											{event.user.socialLinks.whatsapp && (
												<Button
													as="a"
													href={event.user.socialLinks.whatsapp}
													target="_blank"
													rel="noopener noreferrer"
													size="sm"
													variant="flat"
													color="success"
												>
													💬 WhatsApp
												</Button>
											)}
										</div>
									)}
								</div>
							)}
						</CardBody>
					</Card>
				</div>
			</section>
		</DefaultLayout>
	);
}
