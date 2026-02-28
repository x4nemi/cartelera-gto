import { Navbar } from "@/components/navbar";

/**
 * Portal layout: full-width navbar on top, then sidebar + content below.
 * Sidebar is sticky and sits to the left of the posts wall.
 */
export default function PortalLayout({
	sidebar,
	children,
}: {
	sidebar: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col min-h-screen">
			<Navbar />

			{/* Mobile: sidebar stacked full-width above posts */}
			<div className="md:hidden px-[8.33%] pt-4">
				{sidebar}
			</div>

			<div className="flex flex-1 w-full px-[8.33%]">
				{/* Desktop: sidebar sticky below navbar */}
				<aside className="hidden md:block w-72 lg:w-80 shrink-0 sticky top-20 self-start py-4 pr-4">
					{sidebar}
				</aside>

				<main className="flex-1 min-w-0 py-4">
					{children}
				</main>
			</div>

			<footer className="w-full flex items-center justify-center py-6">
				<div className="flex items-center gap-1 text-white italic">
					<span className="text-xs">Hecho por cuevanenses para cuevanenses</span>
				</div>
			</footer>
		</div>
	);
}
