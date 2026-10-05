import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CourseCatalogPage from "./pages/CourseCatalogPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Box } from "@mui/material";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import ProgramsPage from "./pages/ProgramsPage";
import ProgramDetailsPage from "./pages/ProgramDetailsPage";
import CareerPathsPage from "./pages/CareerPathsPage";
import CareerPathDetailsPage from "./pages/CareerPathDetailsPage";
function App() {
  return (
    <BrowserRouter>
      <Box sx={{ bgcolor: "#cee1ed", minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/courses" element={<CourseCatalogPage />} />
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:id" element={<ProgramDetailsPage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="/career-paths/:id" element={<CareerPathDetailsPage />} />
        </Routes>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}
export default App;
