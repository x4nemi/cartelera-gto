import { Button, Card, CardBody, Chip, Link } from "@heroui/react";

import {
	CheckIcon,
  FourIcon,
  IgIcon,
  MailBoxIcon,
  OneIcon,
  RightArrowIcon,
  StarIcon,
  ThreeIcon,
  TwoIcon,
} from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function CreationPage() {
const steps = [
{
			icon: <OneIcon size={26} />,
			title: "Usuario de Instagram",
			description: "Ten a la mano tu cuenta de Instagram o usa tu perfil personal.",
            bgIcon: <IgIcon size={300} className="absolute text-pink-400 opacity-10 -left-20 -bottom-20" />
		},
		{
			icon: <TwoIcon size={26} />,
			title: "Link para crear",
			description: "Se te hará llegar un link para crear tu evento en nuestro formulario.",
			bgIcon: <MailBoxIcon size={300} className="absolute text-pink-400 opacity-10 -right-15 -bottom-10" />
		},
		{
			icon: <ThreeIcon size={26} />,
			title: "Publica tu evento",
			description: "Completa el formulario con título, descripción, fecha y ubicación.",
			bgIcon: <StarIcon size={300} className="absolute text-pink-400 opacity-10 -left-10 -top-10" />
		},
		{
			icon: <FourIcon size={26} />,
			title: "Espera a que se apruebe tu evento",
			description: "Tu evento será revisado y aprobado por nuestro equipo antes de ser publicado.",
			bgIcon: <CheckIcon size={300} className="absolute text-pink-400 opacity-10 -right-10 -top-10" />
		}
	];
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4">
				<div className="flex flex-col max-w-3xl text-center justify-center items-center">
					<h1 className={title()}>¿Te interesa publicar un evento?</h1>
					<p className={subtitle()}>
						Sigue estos pasos
					</p>
					{
						steps.map((step, _) => (
							<Card className="mt-5 w-10/12 bg-pink-50 dark:bg-pink-950 border border-none h-96" shadow="none" key={_}>
								<CardBody>
									<div className="flex flex-col gap-4 items-center justify-center h-full">
										<Chip variant="flat" className="py-5 bg-pink-300 dark:bg-pink-600" size="lg">{step.icon}</Chip>
										<h1 className="text-3xl tracking-tight text-center">{step.title}</h1>
										<span className="text-default-600 text-lg text-center mx-10">{step.description}</span>
									</div>
								</CardBody>
								{!!step.bgIcon && step.bgIcon}
							</Card>
						))
					}
					<Link href="/user" className="w-10/12">
					<Button className="mt-3 bg-pink-400 dark:bg-pink-600 w-full text-white" size="lg" endContent={<RightArrowIcon />}>
					Empezar
					</Button>
					</Link>
				</div>
			</section>
		</DefaultLayout>
	);
}
