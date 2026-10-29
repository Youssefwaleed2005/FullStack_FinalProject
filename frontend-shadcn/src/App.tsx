import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/components/AuthProvider";
import CelebrationProvider from "@/components/fun/CelebrationProvider";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AboutPage from "@/pages/AboutPage";
import CareerPathDetailsPage from "@/pages/CareerPathDetailsPage";
import CareerPathsPage from "@/pages/CareerPathsPage";
import ContactPage from "@/pages/ContactPage";
import CourseCatalogPage from "@/pages/CourseCatalogPage";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";
import AdminCoursesPage from "@/pages/admin/AdminCoursesPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import HomePage from "@/pages/HomePage";
import InstructorCoursePage from "@/pages/InstructorCoursePage";
import InstructorDashboardPage from "@/pages/InstructorDashboardPage";
import LearnerCoursePage from "@/pages/LearnerCoursePage";
import LearnerDashboardPage from "@/pages/LearnerDashboardPage";
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
        <CelebrationProvider>
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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Any signed-in user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Learners only */}
            <Route element={<ProtectedRoute allowedRoles={["Learner"]} />}>
              <Route path="/applications" element={<MyApplicationsPage />} />
              <Route path="/learning" element={<LearnerDashboardPage />} />
              <Route path="/my-enrollments" element={<MyEnrollmentsPage />} />
              <Route
                path="/learning/courses/:id"
                element={<LearnerCoursePage />}
              />
              <Route path="/payment/:applicationId" element={<PaymentPage />} />
              <Route path="/my-payments" element={<MyPaymentsPage />} />
            </Route>

            {/* Instructors only */}
            <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
              <Route path="/instructor" element={<InstructorDashboardPage />} />
              <Route
                path="/instructor/courses/:id"
                element={<InstructorCoursePage />}
              />
            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/content" element={<AdminContentPage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </CelebrationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
