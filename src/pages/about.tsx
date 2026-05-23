import { Accordion, AccordionItem, Chip, Link } from "@heroui/react";
import { Button } from "@/compat/heroui";
import { motion } from "motion/react";

import {
	HeartFilledIcon,
	IgIcon,
	MapPinIcon,
	QuestionIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { RegisteredAccountsMarquee } from "@/components/registeredAccountsMarquee";
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
		q: "Quiero apoyar el proyecto, ¿cómo dono?",
		a: "Puedes donar vía PayPal: <a href='https://www.paypal.com/donate/?hosted_button_id=C42HWJ5ZQW3WN' target='_blank' class='text-primary underline'>Donar ahora</a>. Cada granito ayuda a mantener viva la cartelera.",
	}
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
			<section className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 mt-8 md:mt-12 mb-20 gap-8 md:gap-12">
				{/* About hero — what / who / why */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center text-center gap-4 md:gap-5 pt-4 md:pt-8"
				>
					<div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary/10 text-primary">
						<Logo size={40} />
					</div>
					<div className="flex flex-col gap-2 items-center">
						<Chip size="sm" variant="soft" color="accent" className="rounded-lg font-medium">
							Sobre Cartelera GTO
						</Chip>
						<h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
							La cartelera <span className="text-primary">cuevanense</span>, hecha por la comunidad.
						</h1>
						<p className={subtitle({ class: "max-w-xl" })}>
							Un solo lugar para enterarte de los conciertos, talleres, exposiciones y eventos que pasan en Guanajuato capital — sin scrollear cinco perfiles distintos de Instagram.
						</p>
					</div>

					{/* Three-pillar cards: what / who / why */}
					<motion.ul
						initial="hidden"
						animate="visible"
						variants={{
							hidden: {},
							visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
						}}
						className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full pt-4"
					>
						<motion.li
							variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
							className="flex flex-col items-start gap-2 p-4 md:p-5 rounded-3xl bg-content1/70 backdrop-blur-md border border-default text-left"
						>
							<div className="text-primary">
								<QuestionIcon size={22} />
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm md:text-base">¿Qué es?</span>
								<p className="text-default-600 text-xs md:text-sm leading-snug">
									Una cartelera digital donde organizadores publican sus eventos y la comunidad los descubre en un calendario único.
								</p>
							</div>
						</motion.li>
						<motion.li
							variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
							className="flex flex-col items-start gap-2 p-4 md:p-5 rounded-3xl bg-content1/70 backdrop-blur-md border border-default text-left"
						>
							<div className="text-primary">
								<MapPinIcon size={22} />
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm md:text-base">¿Para quién?</span>
								<p className="text-default-600 text-xs md:text-sm leading-snug">
									Para cuevanenses que quieren vivir la cultura local: estudiantes, vecinos y todos los que hacen comunidad en Guanajuato.
								</p>
							</div>
						</motion.li>
						<motion.li
							variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
							className="flex flex-col items-start gap-2 p-4 md:p-5 rounded-3xl bg-content1/70 backdrop-blur-md border border-default text-left"
						>
							<div className="text-danger">
								<HeartFilledIcon size={22} />
							</div>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-sm md:text-base">¿Por qué?</span>
								<p className="text-default-600 text-xs md:text-sm leading-snug">
									Porque la cultura local merece un espacio propio: gratis, sin algoritmos turísticos y pensado para los que viven aquí.
								</p>
							</div>
						</motion.li>
					</motion.ul>
				</motion.div>

				{/* Registered organizers marquee */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="w-full"
				>
					<RegisteredAccountsMarquee />
				</motion.div>

				{/* FAQ section header */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="flex flex-col items-center text-center gap-2 pt-4 border-t border-default w-full"
				>
					<h2 className="text-2xl md:text-3xl font-semibold tracking-tight pt-6">
						Preguntas frecuentes
					</h2>
					<p className={subtitle({ class: "max-w-md text-sm md:text-base" })}>
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
										variant="soft"
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
										variant="tertiary"
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
						href="https://www.instagram.com/cartelera.gto/"
						isExternal
						className="md:self-center"
					>
						<Button color="accent" startContent={<IgIcon size={18} />}>
							@cartelera.gto
						</Button>
					</Link>
				</motion.div>
			</section>
		</DefaultLayout>
	);
}
