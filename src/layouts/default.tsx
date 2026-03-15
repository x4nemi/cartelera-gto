import { Navbar } from "@/components/nav/navbar";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col min-h-screen">
			<Navbar />
			<main className="w-full px-3 flex flex-grow">
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
