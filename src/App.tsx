import { Route, Routes, useNavigate } from "react-router-dom";

import IndexPage from "@/pages/index";
import PublishPage from "@/pages/publish";
import { UserPage } from "./pages/user";
import { addToast } from "@heroui/react";
import { SmileyFilledIcon, XIcon } from "./components/icons";
import CreationPage from "./pages/docs";
import { PublishedPost } from "./pages/publishedPost";
import DocsPage from "./pages/about";
import { Portal } from "./pages/portal";
import NotFoundPage from "./pages/notFound";
import HeroPage from "./pages/hero";
import { Admin } from "./pages/admin";

function App() {
	const isFirstTime = !localStorage.getItem("hasVisitedBefore");
	const navigate = useNavigate();
	if (isFirstTime) {
		localStorage.setItem("hasVisitedBefore", "true");
		addToast({
			title: "¡Bienvenido a Cartelera Gto!",
			description: "Explora eventos por emprendimientos locales en Guanajuato.",
			timeout: 8000,
			variant: "flat",
			// color: "success",
			size: "lg",
			classNames: {
				description: "pr-3",
				closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
				icon: "w-10 h-10 pr-0 -mr-1 text-amber-300"
			},
			closeIcon: (
				<XIcon size={16} />
			),
			icon: (<SmileyFilledIcon size={10} className="" />),

		});
		navigate("/acerca");
	}
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<CreationPage />} path="/creacion" />
			<Route element={<PublishPage />} path="/:username/publicar" />
			<Route element={<UserPage />} path="/user" />
			<Route element={<PublishedPost  />} path="/completado/:id" />
			<Route element={<DocsPage />} path="/faq" />
			<Route element={<Portal />} path="/:username" />
			<Route element={<HeroPage />} path="/acerca" />
			<Route element={<Admin />} path="/admin/yop" />
			<Route element={<NotFoundPage />} path="*" />
		</Routes>
	);
}

export default App;
