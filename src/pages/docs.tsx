import { Button, Card, CardBody, Chip, Link } from "@heroui/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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

const steps = [
	{
		icon: <OneIcon size={26} />,
		title: "Usuario de Instagram",
		description: "Ten a la mano tu cuenta de Instagram o usa tu perfil personal.",
		bgIcon: <IgIcon size={300} className="absolute text-primary-400 opacity-10 -left-20 -bottom-20" />,
	},
	{
		icon: <TwoIcon size={26} />,
		title: "Link para crear",
		description: "Se te hará llegar un link para crear tu evento en nuestro formulario.",
		bgIcon: <MailBoxIcon size={300} className="absolute text-primary-400 opacity-10 -right-15 -bottom-10" />,
	},
	{
		icon: <ThreeIcon size={26} />,
		title: "Publica tu evento",
		description: "Completa el formulario con título, descripción, fecha y ubicación.",
		bgIcon: <StarIcon size={300} className="absolute text-primary-400 opacity-10 -left-10 -top-10" />,
	},
	{
		icon: <FourIcon size={26} />,
		title: "Espera a que se apruebe tu evento",
		description: "Tu evento será revisado y aprobado por nuestro equipo antes de ser publicado.",
		bgIcon: <CheckIcon size={300} className="absolute text-primary-400 opacity-10 -right-10 -top-10" />,
	},
];

export default function CreationPage() {
	const [topIndex, setTopIndex] = useState(0);

	function dismissTop() {
		if (topIndex >= steps.length - 1) return;
		setTopIndex((prev) => prev + 1);
	}

	function reset() {
		setTopIndex(0);
	}

	// Cards visible in the stack (top card + up to 2 behind it for depth)
	const visibleCards = steps
		.map((step, i) => ({ step, i }))
		.filter(({ i }) => i >= topIndex && i < topIndex + 3)
		.reverse(); // render bottom-most first so top card is last in DOM (on top)

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 w-full mt-10">
				<div className="flex flex-col max-w-3xl w-full text-center justify-center items-center">
					<h1 className={title()}>¿Te interesa publicar un evento?</h1>
					<p className={subtitle()}>Sigue estos pasos</p>
					<div
						className="relative w-full mt-5 cursor-pointer"
						style={{ height: 420 }}
						role="button"
						tabIndex={0}
						onClick={// Dismiss top card on click, or reset stack if on last card
							topIndex >= steps.length - 1 ? reset : dismissTop
						}
						onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") {
							topIndex >= steps.length - 1 ? reset : dismissTop();
						}}}
					>
						<AnimatePresence>
							{visibleCards.map(({ step, i }) => {
								const depth = i - topIndex; // 0 = top, 1 = behind, 2 = further back
								return (
									<motion.div
										key={i}
										className="absolute inset-0 w-full"
										style={{ zIndex: steps.length - i }}
										initial={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: depth > 1 ? 0 : 1 }}
										animate={{
											scale: 1 - depth * 0.05,
											y: depth * 14,
											opacity: depth > 1 ? 0.5 : 1,
											transition: { type: "spring", visualDuration: 0.4, bounce: 0.25 },
										}}
										exit={{
											y: 600,
											x: -30,
											rotate: -12,
											opacity: 0,
											transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] },
										}}
									>
										<Card
											className="w-full bg-content1/70 backdrop-blur-md border border-default h-96 overflow-hidden "
											shadow="none"
										>
											<CardBody>
												<div className="flex flex-col gap-4 items-center justify-center h-full">
													<Chip variant="flat" className="py-5" color="primary" size="lg">
														{step.icon}
													</Chip>
													<h1 className="text-3xl tracking-tight text-center">{step.title}</h1>
													<span className="text-default-600 text-lg text-center mx-10">
														{step.description}
													</span>
												</div>
											</CardBody>
											{step.bgIcon}
										</Card>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>

					<p className="text-default-400 text-sm mb-3 select-none">
						Toca para continuar · {topIndex + 1} / {steps.length}
					</p>

					<Link href="/user" className="w-10/12">
						<Button color="primary" fullWidth size="lg" endContent={<RightArrowIcon />}>
							Empezar
						</Button>
					</Link>
				</div>
			</section>
		</DefaultLayout>
	);
}

