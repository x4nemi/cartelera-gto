import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col min-h-screen">
			<Navbar />
			<main className="container mx-auto max-w-7xl md:px-6 max-md:px-2 flex-grow pt-16">
				{children}
			</main>
			<footer className="w-full flex items-center justify-center py-6">
				<div className="flex items-center gap-1 text-current">
					<span className="text-xs">Hecho por cuevanenses para </span>
					<p className="text-xs text-secondary">cuevanenses</p>
				</div>
			</footer>
		</div>
	);
}
