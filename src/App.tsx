import { lazy, Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { addToast, Spinner } from "@heroui/react";

import { SmileyFilledIcon, XIcon } from "./components/icons";

// Eagerly load the landing page (most common entry point)
import IndexPage from "@/pages/index";

// Code-split the rest — each becomes its own chunk loaded on demand
const PublishPage     = lazy(() => import("@/pages/publish"));
const UserPage        = lazy(() => import("./pages/user").then(m => ({ default: m.UserPage })));
const CreationPage    = lazy(() => import("./pages/docs"));
const PublishedPost   = lazy(() => import("./pages/publishedPost").then(m => ({ default: m.PublishedPost })));
const DocsPage        = lazy(() => import("./pages/about"));
const Portal          = lazy(() => import("./pages/portal").then(m => ({ default: m.Portal })));
const NotFoundPage    = lazy(() => import("./pages/notFound"));
const HeroPage        = lazy(() => import("./pages/hero"));
const Admin           = lazy(() => import("./pages/admin").then(m => ({ default: m.Admin })));
const EventPage       = lazy(() => import("./pages/event").then(m => ({ default: m.EventPage })));

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
		<Suspense fallback={
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size="lg" />
			</div>
		}>
			<Routes>
				<Route element={<IndexPage />} path="/" />
				<Route element={<CreationPage />} path="/creacion" />
				<Route element={<PublishPage />} path="/:username/publicar" />
				<Route element={<UserPage />} path="/user" />
				<Route element={<PublishedPost  />} path="/completado/:id" />
				<Route element={<EventPage />} path="/evento/:shortCode" />
				<Route element={<DocsPage />} path="/faq" />
				<Route element={<Portal />} path="/:username" />
				<Route element={<HeroPage />} path="/acerca" />
				<Route element={<Admin />} path="/admin/yop" />
				<Route element={<NotFoundPage />} path="*" />
			</Routes>
		</Suspense>
	);
}

export default App;
