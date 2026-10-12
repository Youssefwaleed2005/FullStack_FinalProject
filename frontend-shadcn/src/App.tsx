import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/components/AuthProvider";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import CareerPathDetailsPage from "@/pages/CareerPathDetailsPage";
import CareerPathsPage from "@/pages/CareerPathsPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import CourseCatalogPage from "@/pages/CourseCatalogPage";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import MyApplicationsPage from "@/pages/MyApplicationsPage";
import MyEnrollmentsPage from "@/pages/MyEnrollmentsPage";
import MyPaymentsPage from "@/pages/MyPaymentsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import PaymentPage from "@/pages/PaymentPage";
import ProfilePage from "@/pages/ProfilePage";
import ProgramDetailsPage from "@/pages/ProgramDetailsPage";
import ProgramsPage from "@/pages/ProgramsPage";
import RegisterPage from "@/pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
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

            {/* Not built yet (also placeholders in the MUI version) */}
            <Route path="/about" element={<ComingSoonPage title="About" />} />
            <Route path="/contact" element={<ComingSoonPage title="Contact" />} />

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

            {/* Admin only */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route
                path="/admin"
                element={<ComingSoonPage title="Admin area" />}
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
