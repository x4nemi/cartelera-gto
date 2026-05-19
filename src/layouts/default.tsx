import { Navbar } from "@/components/nav/navbar";
import { PortalNavbar } from "@/components/nav/portalNavbar";
import { isPortalHost } from "@/config/host";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const Nav = isPortalHost() ? PortalNavbar : Navbar;
	return (
		<div className="relative flex flex-col min-h-screen md:mx-[8.33%]">
			<Nav />
			<main className="w-full px-3 flex flex-grow pb-24 md:pb-0 md:pt-20">
				{children}
			</main>
			<footer className="w-full flex items-center justify-center py-6">
				<div className="flex items-center gap-1 text-white italic">
					<span className="text-xs">Hecho por cuevanenses para cuevanenses</span>
				</div>
			</footer>
		</div>
	);
}
