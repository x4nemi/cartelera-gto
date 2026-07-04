import { Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";

import { addToast } from "@/utils/toast";
import { isPortalHost } from "@/config/host";
import { Home } from "./pages";
import { Favorites } from "./pages/favorites";
import { RecurringAll } from "./pages/recurringAll";



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
			}
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
				<Route path="/favoritos" element={<Favorites />} />
				<Route path="/recurrentes" element={<RecurringAll />} />
				<Route path="*" element={<Home />} />
			</Routes>
		</Suspense>
	);
}

export default App;
