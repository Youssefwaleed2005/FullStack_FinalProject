import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CourseCatalogPage from "./pages/CourseCatalogPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import ProgramsPage from "./pages/ProgramsPage";
import ProgramDetailsPage from "./pages/ProgramDetailsPage";
import CareerPathsPage from "./pages/CareerPathsPage";
import CareerPathDetailsPage from "./pages/CareerPathDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage";
import PaymentPage from "./pages/PaymentPage";
import MyPaymentsPage from "./pages/MyPaymentsPage";
import InstructorDashboardPage from "./pages/instructor/InstructorDashboardPage";
import InstructorCoursePage from "./pages/instructor/InstructorCoursePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Box sx={{ bgcolor: "#cee1ed", minHeight: "100vh" }}>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetailsPage />} />
            <Route path="/career-paths" element={<CareerPathsPage />} />
            <Route
              path="/career-paths/:id"
              element={<CareerPathDetailsPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Any signed-in user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Learners only */}
            <Route element={<ProtectedRoute allowedRoles={["Learner"]} />}>
              <Route path="/applications" element={<MyApplicationsPage />} />
              <Route path="/my-enrollments" element={<MyEnrollmentsPage />} />
              <Route path="/payment/:applicationId" element={<PaymentPage />} />
              <Route path="/my-payments" element={<MyPaymentsPage />} />
            </Route>

            {/* Instructors only */}
            <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
              <Route path="/instructor" element={<InstructorDashboardPage />} />
              <Route path="/instructor/courses/:id" element={<InstructorCoursePage />} />
            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route path="/admin" element={<div>Admin area</div>} />
            </Route>
          </Routes>
          <Footer />
        </Box>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
