// Purpose: Implements logic/UI for App.jsx
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/auth/Login'
import AdminDashboard from './components/dashboards/AdminDashboard'
import EmployeeDashboard from './components/dashboards/EmployeeDashboard'
import TrainerDashboard from './components/dashboards/TrainerDashboard'
import SlidingSidebar from './components/SlideBar/SlidingSidebar'
import { useAuth } from './contexts/AuthContext'
import AdminMembersPage from './pages/admin/AdminMembersPage'
import AdminOnboardingPage from './pages/admin/AdminOnboardingPage'
import AdminCreateMemberPage from './pages/admin/AdminCreateMemberPage'
import AdminSetupOnboardingPage from './pages/admin/AdminSetupOnboardingPage'
import AdminAttendancePage from './pages/admin/AdminAttendancePage'
import EmployeeTasksPage from './pages/employee/EmployeeTasksPage'
import EmployeeCalendarPage from './pages/employee/EmployeeCalendarPage'
import EmployeeChecklistPage from './pages/employee/EmployeeChecklistPage'
import EmployeeProfilePage from './pages/employee/EmployeeProfilePage'
import TrainerModulesPage from './pages/trainer/TrainerModulesPage'
import TrainerReviewsPage from './pages/trainer/TrainerReviewsPage'
import TrainerCreateModulePage from './pages/trainer/TrainerCreateModulePage'
import TrainerCreateQuizPage from './pages/trainer/TrainerCreateQuizPage'
import TrainerWeeklyReviewPage from './pages/trainer/TrainerWeeklyReviewPage'

const getHomePath = (role) => {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'trainer') return '/trainer/dashboard'
  return '/employee/dashboard'
}

const RoleScopedRoutes = () => {
  const { user, logout } = useAuth()
  const homePath = getHomePath(user?.role)

  return (
    <>
      <SlidingSidebar user={user} onLogout={logout} />

      <Routes>

        <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to={homePath} replace />} />
        <Route path="/admin/create-member" element={user?.role === 'admin' ? <AdminCreateMemberPage /> : <Navigate to={homePath} replace />} />
        <Route path="/admin/setup-onboarding" element={user?.role === 'admin' ? <AdminSetupOnboardingPage /> : <Navigate to={homePath} replace />} />
        <Route path="/admin/attendance" element={user?.role === 'admin' ? <AdminAttendancePage /> : <Navigate to={homePath} replace />} />
        <Route path="/admin/members" element={user?.role === 'admin' ? <AdminMembersPage /> : <Navigate to={homePath} replace />} />
        <Route path="/admin/onboarding" element={user?.role === 'admin' ? <AdminOnboardingPage /> : <Navigate to={homePath} replace />} />

        <Route path="/employee/dashboard" element={user?.role === 'employee' ? <EmployeeDashboard /> : <Navigate to={homePath} replace />} />
        <Route path="/employee/checklist" element={user?.role === 'employee' ? <EmployeeChecklistPage /> : <Navigate to={homePath} replace />} />
        <Route path="/employee/profile" element={user?.role === 'employee' ? <EmployeeProfilePage /> : <Navigate to={homePath} replace />} />
        <Route path="/employee/tasks" element={user?.role === 'employee' ? <EmployeeTasksPage /> : <Navigate to={homePath} replace />} />
        <Route path="/employee/calendar" element={user?.role === 'employee' ? <EmployeeCalendarPage /> : <Navigate to={homePath} replace />} />

        <Route path="/trainer/dashboard" element={user?.role === 'trainer' ? <TrainerDashboard /> : <Navigate to={homePath} replace />} />
        <Route path="/trainer/create-module" element={user?.role === 'trainer' ? <TrainerCreateModulePage /> : <Navigate to={homePath} replace />} />
        <Route path="/trainer/create-quiz" element={user?.role === 'trainer' ? <TrainerCreateQuizPage /> : <Navigate to={homePath} replace />} />
        <Route path="/trainer/weekly-review" element={user?.role === 'trainer' ? <TrainerWeeklyReviewPage /> : <Navigate to={homePath} replace />} />
        <Route path="/trainer/modules" element={user?.role === 'trainer' ? <TrainerModulesPage /> : <Navigate to={homePath} replace />} />
        <Route path="/trainer/reviews" element={user?.role === 'trainer' ? <TrainerReviewsPage /> : <Navigate to={homePath} replace />} />

        <Route path="*" element={<Navigate to={homePath} replace />} />
      </Routes>
    </>
  )
}

const App = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getHomePath(user?.role)} replace /> : <Login />}
      />
      <Route
        path="/*"
        element={isAuthenticated ? <RoleScopedRoutes /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App

