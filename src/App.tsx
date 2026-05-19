import { lazy, Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { addToast, Spinner } from "@heroui/react";

import { SmileyFilledIcon, XIcon } from "./components/icons";
import { isPortalHost } from "@/config/host";

// Eagerly load the landing page (most common entry point)
import IndexPage from "@/pages/index";

// Code-split the rest — each becomes its own chunk loaded on demand
const PublishPage     = lazy(() => import("@/pages/publish"));
const UserPage        = lazy(() => import("./pages/user").then(m => ({ default: m.UserPage })));
const CreationPage    = lazy(() => import("./pages/docs"));
const PublishedPost   = lazy(() => import("./pages/publishedPost").then(m => ({ default: m.PublishedPost })));
const DocsPage        = lazy(() => import("./pages/about"));
const Portal          = lazy(() => import("./pages/portal").then(m => ({ default: m.Portal })));
const PortalHomePage  = lazy(() => import("./pages/portalHome"));
const NotFoundPage    = lazy(() => import("./pages/notFound"));
const HeroPage        = lazy(() => import("./pages/hero"));
const Admin           = lazy(() => import("./pages/admin").then(m => ({ default: m.Admin })));
const EventPage       = lazy(() => import("./pages/event").then(m => ({ default: m.EventPage })));

function PublicRoutes() {
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<CreationPage />} path="/creacion" />
			<Route element={<PublishedPost />} path="/completado/:id" />
			<Route element={<EventPage />} path="/evento/:shortCode" />
			<Route element={<DocsPage />} path="/faq" />
			<Route element={<HeroPage />} path="/acerca" />
			{/* Public profile view (read-only) — keep last because of the catch-all param */}
			<Route element={<Portal readOnly />} path="/:username" />
			<Route element={<NotFoundPage />} path="*" />
		</Routes>
	);
}

function PortalRoutes() {
	return (
		<Routes>
			<Route element={<PortalHomePage />} path="/" />
			<Route element={<UserPage />} path="/registro" />
			<Route element={<PublishPage />} path="/publicar" />
			<Route element={<PublishedPost />} path="/completado/:id" />
			<Route element={<Admin />} path="/admin/yop" />
			<Route element={<NotFoundPage />} path="*" />
		</Routes>
	);
}

function App() {
	const isFirstTime = !localStorage.getItem("hasVisitedBefore");
	const navigate = useNavigate();
	const portal = isPortalHost();

	if (isFirstTime && !portal) {
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
			{portal ? <PortalRoutes /> : <PublicRoutes />}
		</Suspense>
	);
}

export default App;
