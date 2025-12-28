import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CreationPage from "@/pages/docs";
import PublishPage from "@/pages/publish";
import { UserPage } from "./pages/user";

function App() {
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<CreationPage />} path="/creacion" />
			<Route element={<PublishPage />} path="/publicar" />
			<Route element={<UserPage />} path="/user" />
      {/* <Route element={<AboutPage />} path="/about" /> */}
		</Routes>
	);
}

export default App;
