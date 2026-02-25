// Purpose: Implements logic/UI for SlidingSidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Folder,
  LayoutDashboard,
  User,
  UserPlus,
} from 'lucide-react'

const linksByRole = {
  admin: [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/create-member', label: 'Employee', icon: UserPlus },
    { to: '/admin/setup-onboarding', label: 'Setup Onboarding', icon: Calendar },
    { to: '/admin/attendance', label: 'Attendance', icon: BarChart3 },
    { to: '/admin/members', label: 'Members', icon: Folder },
    { to: '/admin/onboarding', label: 'Onboarding', icon: Calendar },
  ],
  trainer: [
    { to: '/trainer/dashboard', label: 'Trainer Dashboard', icon: LayoutDashboard },
    { to: '/trainer/modules', label: 'Modules', icon: Folder },
    { to: '/trainer/reviews', label: 'Reviews', icon: Calendar },
    { to: '/trainer/create-module', label: 'Create Module', icon: Folder },
    { to: '/trainer/create-quiz', label: 'Create Quiz', icon: ClipboardList },
    { to: '/trainer/weekly-review', label: 'Weekly Review', icon: Calendar },
  ],
  employee: [
    { to: '/employee/dashboard', label: 'Employee Dashboard', icon: LayoutDashboard },
    { to: '/employee/checklist', label: 'Checklist', icon: ClipboardList },
    { to: '/employee/profile', label: 'Profile', icon: User },
    { to: '/employee/tasks', label: 'Tasks', icon: Folder },
    { to: '/employee/calendar', label: 'Calendar', icon: Calendar },
  ],
}

const Sidebar = ({ user, onLogout }) => {
  const role = user?.role || 'employee'
  const links = linksByRole[role] || linksByRole.employee

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-4">
        <h2 className="text-lg font-bold capitalize">{role} Menu</h2>
      </div>

      <nav className="mt-6 space-y-3 px-4">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md p-2 transition ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          )
        })}
      </nav>
      <div className="mt-6 px-4">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-md bg-rose-500 px-3 py-2 font-semibold text-white transition hover:bg-rose-400"
        >
          Log Out
        </button>
      </div>

    </aside>
  )
}

export default Sidebar

