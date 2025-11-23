import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import PricingPage from "@/pages/pricing";
import CreationPage from "@/pages/docs";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CreationPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      {/* <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" /> */}
    </Routes>
  );
}

export default App;
