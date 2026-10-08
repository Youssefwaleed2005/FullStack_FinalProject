import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ComingSoonPage from "@/pages/ComingSoonPage";
import CourseCatalogPage from "@/pages/CourseCatalogPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseCatalogPage />} />

          {/* Not rebuilt yet */}
          <Route
            path="/courses/:id"
            element={<ComingSoonPage title="Course details" />}
          />
          <Route path="/programs" element={<ComingSoonPage title="Programs" />} />
          <Route
            path="/career-paths"
            element={<ComingSoonPage title="Career Paths" />}
          />
          <Route
            path="/career-paths/:id"
            element={<ComingSoonPage title="Career path details" />}
          />
          <Route path="/about" element={<ComingSoonPage title="About" />} />
          <Route path="/contact" element={<ComingSoonPage title="Contact" />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
