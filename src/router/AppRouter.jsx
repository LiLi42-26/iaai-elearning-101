import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from '@/layouts/AdminLayout'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import PublicLayout from '@/layouts/PublicLayout'
import PrivateRoute from '@/router/PrivateRoute'
import AdminRoute from '@/router/AdminRoute'

import AdminCoursesPage from '@/pages/Admin/AdminCoursesPage'
import AdminHomePage from '@/pages/Admin/AdminHomePage'
import AdminUsersPage from '@/pages/Admin/AdminUsersPage'
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage'
import VerifyEmailPage from '@/pages/Auth/VerifyEmailPage'
import CertificatesPage from '@/pages/Certificates/CertificatesPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import LandingPage from '@/pages/Landing/LandingPage'
import CurriculumPage from '@/pages/Learning/CurriculumPage'
import LessonPage from '@/pages/Learning/LessonPage'
import ModulePage from '@/pages/Learning/ModulePage'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'
import OnboardingPage from '@/pages/Onboarding/OnboardingPage'
import ProfilePage from '@/pages/Profile/ProfilePage'
import QuizPage from '@/pages/Quiz/QuizPage'
import QuizResultPage from '@/pages/Quiz/QuizResultPage'
import NotificationsPage from '@/pages/Notifications/NotificationsPage'
import CommunautePage from '@/pages/Community/CommunautePage'
import SettingsPage from '@/pages/Settings/SettingsPage'
import UpgradePage from '@/pages/Settings/UpgradePage'
import { ROUTES } from '@/constants/routes'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
        </Route>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
        </Route>

        {/* ONBOARDING — protégé */}
        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.ONBOARDING_1} element={<OnboardingPage />} />
          <Route path={ROUTES.ONBOARDING_2} element={<OnboardingPage />} />
          <Route path={ROUTES.ONBOARDING_3} element={<OnboardingPage />} />
        </Route>

        {/* APP — protégé */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.CURRICULUM} element={<CurriculumPage />} />
            <Route path="/module/:id" element={<ModulePage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/quiz/result/:id" element={<QuizResultPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path={ROUTES.CERTIFICATES} element={<CertificatesPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path={ROUTES.COMMUNITY} element={<CommunautePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.SUBSCRIPTION} element={<UpgradePage />} />
          </Route>
        </Route>

        {/* ADMIN — protégé + rôle ADMIN */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN} element={<AdminHomePage />} />
            <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            <Route path={ROUTES.ADMIN_COURSES} element={<AdminCoursesPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter