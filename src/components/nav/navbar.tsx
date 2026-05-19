import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";
import { PORTAL_DOMAIN } from "@/config/site";
import { ThemeSwitch } from "@/components/nav/theme-switch";
import {
	CalendarIcon,
	PlusIcon,
	QuestionIcon,
} from "@/components/icons";
import { useLocation } from "react-router-dom";

type NavEntry = {
	label: string;
	short: string;
	href: string;
	icon: React.ReactNode;
	external?: boolean;
};

const NAV: NavEntry[] = [
	{ label: "Inicio", short: "Inicio", href: "/", icon: <CalendarIcon size={20} /> },
	{ label: "Publicar", short: "Publicar", href: "/creacion", icon: <PlusIcon size={20} /> },
	{ label: "Acerca", short: "Acerca", href: "/faq", icon: <QuestionIcon size={20} /> },
];

const PORTAL_LINK: NavEntry = {
	label: "Portal de negocios",
	short: "Portal",
	href: PORTAL_DOMAIN,
	icon: <PlusIcon size={20} />,
	external: true,
};

export const Navbar = () => {
	const location = useLocation();

	return (
		<div className="fixed bottom-0 inset-x-0 md:fixed md:top-0 md:bottom-auto z-50 flex justify-center pt-1 pb-3 md:pt-3 md:pb-1">
			<div className="bg-content1/70 backdrop-blur-sm rounded-full border border-default flex items-center gap-1 px-2 py-1.5 shadow-sm">
				{/* Brand */}
				<Link
					href="/"
					color="foreground"
					aria-label={siteConfig.name}
					className="flex items-center justify-center size-10 rounded-full hover:bg-content2 transition-colors"
				>
					<img
						src="/favicon.ico"
						alt=""
						aria-hidden
						className="size-6 object-contain dark:invert"
					/>
				</Link>

				<div className="w-px h-6 bg-default/40 mx-1" aria-hidden />

				{/* Nav items */}
				<nav className="flex items-center gap-1">
					{NAV.map((item) => {
						const isActive = location.pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								color="foreground"
								aria-label={item.label}
								className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors ${
									isActive
										? "bg-primary/15 text-primary font-semibold"
										: "hover:bg-content2"
								}`}
							>
								<span className="shrink-0">{item.icon}</span>
								<span className="hidden sm:inline">{item.short}</span>
							</Link>
						);
					})}
					{/* <Link
						key={PORTAL_LINK.href}
						href={PORTAL_LINK.href}
						isExternal
						color="foreground"
						aria-label={PORTAL_LINK.label}
						className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors hover:bg-content2"
					>
						<span className="shrink-0">{PORTAL_LINK.icon}</span>
						<span>{PORTAL_LINK.short}</span>
					</Link> */}
				</nav>

				<div className="w-px h-6 bg-default/40 mx-1" aria-hidden />

				{/* Theme switch */}
				<div className="flex items-center justify-center size-10">
					<ThemeSwitch />
				</div>
			</div>
		</div>
	);
};
