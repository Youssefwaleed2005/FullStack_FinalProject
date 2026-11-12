import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/components/AuthProvider";
import CelebrationProvider from "@/components/fun/CelebrationProvider";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import MyLearningProvider from "@/components/MyLearningProvider";
import SiteSettingsProvider from "@/components/SiteSettingsProvider";
import ThemeProvider from "@/components/ThemeProvider";
import ToastProvider from "@/components/ToastProvider";
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
import LearnerCalendarPage from "@/pages/LearnerCalendarPage";
import LearnerDashboardPage from "@/pages/LearnerDashboardPage";
import LoginPage from "@/pages/LoginPage";
import MyApplicationsPage from "@/pages/MyApplicationsPage";
import MyEnrollmentsPage from "@/pages/MyEnrollmentsPage";
import MyPaymentsPage from "@/pages/MyPaymentsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import PaymentPage from "@/pages/PaymentPage";
import ProfilePage from "@/pages/ProfilePage";
import ComparePage from "@/pages/ComparePage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import QuizPage from "@/pages/QuizPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import SavedCoursesPage from "@/pages/SavedCoursesPage";
import CertificatePage from "@/pages/CertificatePage";
import ProgramDetailsPage from "@/pages/ProgramDetailsPage";
import ProgramsPage from "@/pages/ProgramsPage";
import RegisterPage from "@/pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
        <MyLearningProvider>
        <SiteSettingsProvider>
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
            <Route path="/saved" element={<SavedCoursesPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Any signed-in user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Learners only */}
            <Route element={<ProtectedRoute allowedRoles={["Learner"]} />}>
              <Route path="/applications" element={<MyApplicationsPage />} />
              <Route path="/learning" element={<LearnerDashboardPage />} />
              <Route path="/calendar" element={<LearnerCalendarPage />} />
              <Route path="/my-enrollments" element={<MyEnrollmentsPage />} />
              <Route
                path="/learning/courses/:id"
                element={<LearnerCoursePage />}
              />
              <Route
                path="/learning/courses/:id/certificate"
                element={<CertificatePage />}
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
        </SiteSettingsProvider>
        </MyLearningProvider>
      </AuthProvider>
      </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
