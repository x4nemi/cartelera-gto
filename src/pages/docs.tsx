import { Button, Link } from "@heroui/react";
import { motion } from "motion/react";

import {
	IgIcon,
	MapPinIcon,
	RightArrowIcon,
} from "@/components/icons";
import { subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const requirements = [
	{
		icon: <IgIcon size={28} />,
		title: "Cuenta de Instagram pública",
		description:
			"La usamos para extraer las imágenes y los detalles de tu evento.",
	},
	{
		icon: <MapPinIcon size={28} />,
		title: "Eventos en Guanajuato, para locales",
		description:
			"Cartelera es para la comunidad cuevanense. No publicamos eventos pensados para turismo.",
	},
];

export default function CreationPage() {
	return (
		<DefaultLayout>
			<section className="flex flex-col items-center justify-center gap-6 w-full mt-16 mb-20 px-4">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="flex flex-col max-w-xl w-full text-center items-center gap-2"
				>
					<h1 className="md:text-5xl text-4xl font-semibold">
						Antes de empezar
					</h1>
					<p className={subtitle()}>
						Solo necesitas dos cosas para publicar tu evento.
					</p>
				</motion.div>

				<motion.ul
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
					}}
					className="flex flex-col gap-3 w-full max-w-xl"
				>
					{requirements.map((req, i) => (
						<motion.li
							key={i}
							variants={{
								hidden: { opacity: 0, y: 10 },
								visible: { opacity: 1, y: 0 },
							}}
							className="flex items-start gap-4 p-5 rounded-2xl bg-content1/70 backdrop-blur-md border border-default"
						>
							<div className="text-primary shrink-0 mt-0.5">{req.icon}</div>
							<div className="flex flex-col gap-1 text-left">
								<span className="font-semibold text-lg leading-tight">
									{req.title}
								</span>
								<span className="text-default-600 text-sm">
									{req.description}
								</span>
							</div>
						</motion.li>
					))}
				</motion.ul>

				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.45, duration: 0.35 }}
					className="w-full max-w-xl flex flex-col items-center gap-2"
				>
					<Link href="/user" className="w-full">
						<Button
							color="primary"
							size="lg"
							fullWidth
							endContent={<RightArrowIcon />}
						>
							Empezar
						</Button>
					</Link>
					<p className="text-default-500 text-xs text-center">
						Al continuar aceptas que tu evento será revisado por nuestro
						equipo antes de publicarse.
					</p>
				</motion.div>
			</section>
		</DefaultLayout>
	);
}
