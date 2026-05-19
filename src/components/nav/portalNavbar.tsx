import { Link } from "@heroui/link";
import { Button } from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/nav/theme-switch";
import {
	CalendarIcon,
	PlusIcon,
	XIcon,
} from "@/components/icons";
import { clearPortalSession } from "@/config/portalSession";
import { usePortalSession } from "@/hooks/usePortalSession";

type NavEntry = {
	label: string;
	short: string;
	href: string;
	icon: React.ReactNode;
};

const NAV: NavEntry[] = [
	{ label: "Inicio", short: "Inicio", href: "/", icon: <CalendarIcon size={20} /> },
	{ label: "Publicar", short: "Publicar", href: "/publicar", icon: <PlusIcon size={20} /> },
];

export const PortalNavbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const username = usePortalSession();

	const handleLogout = () => {
		clearPortalSession();
		navigate("/");
	};

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
				</nav>

				{username && (
					<>
						<div className="w-px h-6 bg-default/40 mx-1" aria-hidden />
						<Button
							size="sm"
							variant="light"
							onPress={handleLogout}
							className="rounded-full h-9 px-3 text-sm"
							aria-label="Cerrar sesión"
							startContent={<XIcon size={16} />}
						>
							<span className="hidden sm:inline">Salir</span>
						</Button>
					</>
				)}

				<div className="w-px h-6 bg-default/40 mx-1" aria-hidden />

				<div className="flex items-center justify-center size-10">
					<ThemeSwitch />
				</div>
			</div>
		</div>
	);
};
