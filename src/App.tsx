import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import PublishPage from "@/pages/publish";
import { UserPage } from "./pages/user";
import EventDetailPage from "@/pages/event/[slug]/index";
import { addToast } from "@heroui/react";
import { SmileyFilledIcon, XIcon } from "./components/icons";

function App() {
	const isFirstTime = !localStorage.getItem("hasVisitedBefore");
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
	}
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			{/* <Route element={<CreationPage />} path="/creacion" /> */}
			<Route element={<PublishPage />} path="/publicar" />
			<Route element={<UserPage />} path="/user" />
			<Route element={<EventDetailPage />} path="/evento/:slug" />
			{/* <Route element={<AboutPage />} path="/about" /> */}
		</Routes>
	);
}

export default App;
