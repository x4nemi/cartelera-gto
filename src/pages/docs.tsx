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
import { subtitle } from "@/components/primitives";
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

	function dismissTop(e: React.MouseEvent | React.KeyboardEvent) {
		e.preventDefault();
		if (topIndex >= steps.length - 1) return;
		setTopIndex((prev) => prev + 1);
	}

	function reset(e: React.MouseEvent | React.KeyboardEvent) {
		e.preventDefault();
		setTopIndex(0);
	}

	function hasReachedEnd() {
		return topIndex >= steps.length - 1;
	}

	// Cards visible in the stack (top card + up to 2 behind it for depth)
	const visibleCards = steps
		.map((step, i) => ({ step, i }))
		.filter(({ i }) => i >= topIndex && i < topIndex + 3)
		.reverse(); // render bottom-most first so top card is last in DOM (on top)

	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-4 w-full mt-10 mx-2 mb-20">
				<div className="flex flex-col max-w-3xl w-full text-center justify-center items-center">
					<h1 className="md:text-5xl text-4xl font-semibold">¿Te interesa publicar un evento?</h1>
					<p className={subtitle()}>Sigue estos pasos</p>

					<p className="text-default-500 text-sm  mt-4 select-none">
						Toca para continuar · {topIndex + 1} / {steps.length}
					</p>
					<div
						className="relative w-full mt-5 cursor-pointer"
						style={{ height: 420, WebkitTapHighlightColor: "transparent" }}
						role="button"
						tabIndex={0}
						onClick={(e) => {
							topIndex >= steps.length - 1 ? reset(e) : dismissTop(e);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								topIndex >= steps.length - 1 ? reset(e) : dismissTop(e);
							}
						}}
					>
						<AnimatePresence>
							{visibleCards.map(({ step, i }) => {
								const depth = i - topIndex; // 0 = top, 1 = behind, 2 = further back
								return (
									<motion.div
										key={i}
										className="absolute inset-0 w-full will-change-transform"
										style={{ zIndex: steps.length - i }}
										initial={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: depth > 1 ? 0 : 1 }}
										animate={{
											scale: 1 - depth * 0.05,
											y: depth * 14,
											opacity: depth > 1 ? 0.5 : 1,
											transition: { type: "spring", visualDuration: 0.4, bounce: 0.25 },
										}}
										exit={{
											y: 40,
											scale: 0.92,
											opacity: 0,
											transition: { duration: 0.35, ease: "easeIn" },
										}}
									>
										<Card
											className="w-full bg-content1/70 backdrop-blur-md border border-default h-96 overflow-hidden"
											shadow="none"
										>
											<CardBody>
												<div className="flex flex-col gap-4 items-center justify-center h-full">
													<Chip variant="flat" className="py-5" color="primary" size="lg">
														{step.icon}
													</Chip>
													<h1 className="text-3xl tracking-tight text-center font-semibold">{step.title}</h1>
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
					{
						hasReachedEnd() &&
						<motion.div
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.4,
								scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
							}}
							className="w-full"
						>
							<Link href="/user" >
								<Button color="primary" fullWidth size="lg" endContent={<RightArrowIcon />}>
									Empezar
								</Button>
							</Link>
						</motion.div>

					}
				</div>
			</section>
		</DefaultLayout>
	);
}

