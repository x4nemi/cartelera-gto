import { OneIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, Chip, Divider } from "@heroui/react";

export default function CreationPage() {
	const steps = [
		{
			icon: <OneIcon size={26} />,
			title: "Registro",
			description:
				"Crea una cuenta en nuestra plataforma proporcionando tu información básica.",
		},
		{
			icon: <OneIcon size={26} />,
			title: "Verificación",
			description:
				"Verifica tu correo electrónico para activar tu cuenta y acceder a las funciones de publicación.",
		},
		{
			icon: <OneIcon size={26} />,
			title: "Publica tu Evento",
			description:
				"Completa el formulario de publicación con los detalles de tu evento, incluyendo título, descripción, fecha y ubicación.",
		}];
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4">
				<div className="inline-block max-w-3xl text-center justify-center">
					<h1 className={title()}>¿Te interesa publicar un evento?</h1>
					<p className={subtitle()}>
						Sigue estos pasos
					</p>
					{
						steps.map((step, _) => (
							<Card className="mt-5 bg-pink-50 border border-none " shadow="none">
								<CardBody>
									<div className="flex flex-col gap-4 justify-start text-start">
										<div className="flex flex-col justify-center">
											<div className="flex gap-2">
												<Chip variant="flat" className="py-5 bg-pink-300" size="lg"><OneIcon size={26} /></Chip>
												<h1 className="text-3xl tracking-tight">{step.title}</h1>
											</div>
											<div className="flex">
												<Divider orientation="vertical" className="h-20 mx-7 w-0.5" />
												<span className="text-default-600 ml-2 mt-2">{step.description}</span>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						))
					}
				</div>
			</section>
		</DefaultLayout>
	);
}
