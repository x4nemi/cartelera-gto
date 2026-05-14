import { Accordion, AccordionItem, Button, Chip, Link } from "@heroui/react";
import { motion } from "motion/react";

import {
	HeartFilledIcon,
	IgIcon,
	QuestionIcon,
} from "@/components/icons";
import { subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

type Faq = {
	q: string;
	a: string;
	category: "Publicar" | "Cuenta" | "Comunidad";
};

const faqs: Faq[] = [
	{
		category: "Publicar",
		q: "¿Cuánto cuesta publicar un evento?",
		a: "Nada. Publicar en Cartelera GTO es y será siempre gratis.",
	},
	{
		category: "Publicar",
		q: "¿Puedo editar o eliminar mi evento después de publicarlo?",
		a: "Sí. Entra a tu perfil, selecciona el evento y elige editar o eliminar.",
	},
	{
		category: "Publicar",
		q: "¿Puedo publicar eventos fuera de Guanajuato?",
		a: "No. Solo aceptamos eventos en Guanajuato capital pensados para la comunidad local.",
	},
	{
		category: "Cuenta",
		q: "¿Cuánto tarda en aprobarse mi usuario?",
		a: "Revisamos cada cuenta a mano. Generalmente entre 1 y 8 horas, dependiendo de la cola.",
	},
	{
		category: "Comunidad",
		q: "¿Cómo puedo contactar al equipo?",
		a: "Escríbenos por Instagram: <a href='https://www.instagram.com/carteleracuevense/' target='_blank' class='text-primary underline'>@carteleracuevense</a>.",
	},
	{
		category: "Comunidad",
		q: "Quiero apoyar el proyecto, ¿cómo dono?",
		a: "Puedes donar vía PayPal: <a href='https://www.paypal.com/donate/?hosted_button_id=C42HWJ5ZQW3WN' target='_blank' class='text-primary underline'>Donar ahora</a>. Cada granito ayuda a mantener viva la cartelera.",
	},
	{
		category: "Comunidad",
		q: "Créditos de fotografía",
		a: "Algunas fotos de fondo son del perfil de Flickr <a href='https://www.flickr.com/photos/anthonysurace/' target='_blank' class='text-primary underline'>Anthony Surace</a>.",
	},
];

const categories: Faq["category"][] = ["Publicar", "Cuenta", "Comunidad"];

const categoryColor: Record<Faq["category"], "primary" | "secondary" | "warning"> = {
	Publicar: "primary",
	Cuenta: "secondary",
	Comunidad: "warning",
};

export default function AboutPage() {
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 mt-12 mb-20 gap-8">
				{/* Hero */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="flex flex-col items-center text-center gap-3"
				>
					<div className="text-primary">
						<QuestionIcon size={48} />
					</div>
					<h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
						Preguntas frecuentes
					</h1>
					<p className={subtitle({ class: "max-w-md" })}>
						Lo más común que nos preguntan sobre Cartelera GTO.
					</p>
				</motion.div>

				{/* Grouped FAQ */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.1 }}
					className="flex flex-col gap-6 w-full"
				>
					{categories.map((cat) => {
						const items = faqs.filter((f) => f.category === cat);
						if (items.length === 0) return null;
						return (
							<div key={cat} className="flex flex-col gap-2">
								<div className="flex items-center gap-2 px-1">
									<Chip
										size="sm"
										variant="flat"
										color={categoryColor[cat]}
										className="font-semibold"
									>
										{cat}
									</Chip>
									<span className="text-default-400 text-xs">
										{items.length} {items.length === 1 ? "pregunta" : "preguntas"}
									</span>
								</div>
								<div className="rounded-3xl bg-content1/60 backdrop-blur-md border border-default p-2 md:p-3">
									<Accordion
										variant="light"
										itemClasses={{
											base: "px-2",
											title: "font-semibold text-base",
											content: "text-default-600 text-sm pt-0 pb-3",
										}}
									>
										{items.map((faq, i) => (
											<AccordionItem key={`${cat}-${i}`} title={faq.q}>
												<p
													className="text-start"
													dangerouslySetInnerHTML={{ __html: faq.a }}
												/>
											</AccordionItem>
										))}
									</Accordion>
								</div>
							</div>
						);
					})}
				</motion.div>

				{/* CTA footer */}
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, delay: 0.25 }}
					className="w-full rounded-3xl bg-content1/60 backdrop-blur-md border border-default p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
				>
					<div className="flex items-start gap-3">
						<div className="text-danger mt-1">
							<HeartFilledIcon size={22} />
						</div>
						<div className="flex flex-col">
							<span className="font-semibold text-lg">¿No encontraste tu respuesta?</span>
							<span className="text-default-500 text-sm">
								Escríbenos por Instagram, leemos cada mensaje.
							</span>
						</div>
					</div>
					<Link
						href="https://www.instagram.com/carteleracuevense/"
						isExternal
						className="md:self-center"
					>
						<Button color="primary" startContent={<IgIcon size={18} />}>
							@carteleracuevense
						</Button>
					</Link>
				</motion.div>
			</section>
		</DefaultLayout>
	);
}
