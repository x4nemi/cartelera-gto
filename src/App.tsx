import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CreationPage from "@/pages/docs";
import PublishPage from "@/pages/publish";

function App() {
	return (
		<Routes>
			<Route element={<IndexPage />} path="/" />
			<Route element={<CreationPage />} path="/creacion" />
			<Route element={<PublishPage />} path="/publicar" />
			{/* <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" /> */}
		</Routes>
	);
}

export default App;
