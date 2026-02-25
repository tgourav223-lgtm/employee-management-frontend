// Purpose: Implements logic/UI for AdminDashboard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../shared/Header'
import AttendanceSection from '../shared/AttendanceSection'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'
import { getUsers } from '../../utils/localstorage'

const AdminDashboard = () => {
  const { user  } = useAuth()
  const { onboardingRecords, modules, quizAttempts, reviews } = useTraining()

  const users = getUsers()
  const employees = users.filter((entry) => entry.role === 'employee')

  const totalEmployees = employees.length
  const activeTrainingPrograms = modules.length
  const totalAssigned = modules.length
  const totalCompleted = modules.reduce((acc, module) => acc + module.completedBy.length, 0)
  const completionRate = totalAssigned === 0 ? 0 : Math.round((totalCompleted / totalAssigned) * 100)
  const lowReviewEmails = reviews.filter((review) => review.rating <= 2).map((review) => review.employeeEmail)
  const failedQuizEmails = quizAttempts.filter((attempt) => !attempt.passed).map((attempt) => attempt.employeeEmail)
  const underperformingEmployees = new Set([...lowReviewEmails, ...failedQuizEmails]).size

  return (
    <div className="ml-64 p-6 min-h-screen bg-slate-950">
      <Header
        title="Admin Dashboard"
        subtitle={user?.designation || 'Workspace'}
        userName={user?.name}
        accent="rose"
      />

      <section className="bg-slate-950 px-4 pb-10 pt-2 md:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm font-medium">Total Employees</p>
              <h3 className="text-3xl font-bold">{totalEmployees}</h3>
            </article>
            <article className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm font-medium">Active Programs</p>
              <h3 className="text-3xl font-bold">{activeTrainingPrograms}</h3>
            </article>
            <article className="rounded-xl border border-violet-700 bg-violet-600 p-4 text-violet-50">
              <p className="text-sm font-medium">Completion Rate</p>
              <h3 className="text-3xl font-bold">{completionRate}%</h3>
            </article>
            <article className="rounded-xl border border-rose-700 bg-rose-600 p-4 text-rose-50">
              <p className="text-sm font-medium">Underperforming</p>
              <h3 className="text-3xl font-bold">{underperformingEmployees}</h3>
            </article>
          </div>

          <AttendanceSection role="admin" />

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-semibold text-white">Quick Actions</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <Link to="/admin/create-member" className="rounded-xl border border-rose-500/40 bg-slate-950 p-4 text-white transition hover:bg-slate-800">
                <p className="font-semibold">Add New Employee/Member</p>
                <p className="mt-1 text-sm text-slate-300">Create accounts for employees, trainers, or admins.</p>
              </Link>
              <Link to="/admin/setup-onboarding" className="rounded-xl border border-emerald-500/40 bg-slate-950 p-4 text-white transition hover:bg-slate-800">
                <p className="font-semibold">Employee Onboarding Setup</p>
                <p className="mt-1 text-sm text-slate-300">Assign trainer, department, duration, and joining date.</p>
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="mb-3 text-xl font-semibold text-white">Onboarding Tracking</h3>
            <div className="space-y-2">
              {onboardingRecords.length === 0 ? <p className="text-slate-300">No onboarding records yet.</p> : null}
              {onboardingRecords.map((record) => (
                <div key={record.id} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-sm text-slate-200">
                  <p><span className="font-semibold">Employee:</span> {record.employeeEmail}</p>
                  <p><span className="font-semibold">Department:</span> {record.department}</p>
                  <p><span className="font-semibold">Trainer:</span> {record.trainerEmail}</p>
                  <p><span className="font-semibold">Duration:</span> {record.trainingDurationWeeks} weeks</p>
                  <p><span className="font-semibold">Joining:</span> {record.joiningDate}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-5">
            <h3 className="mb-3 text-xl font-semibold text-white">Project Pipeline</h3>
            <p className="mb-4 text-sm text-slate-300">Quick snapshot of active training projects/modules.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {modules.length === 0 ? <p className="text-slate-300">No active projects yet.</p> : null}
              {modules.slice(0, 6).map((module) => (
                <div key={module.id} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-sm text-slate-200">
                  <p><span className="font-semibold">Title:</span> {module.title}</p>
                  <p><span className="font-semibold">Assignee:</span> {module.assignee}</p>
                  <p><span className="font-semibold">Trainer:</span> {module.trainerEmail}</p>
                  <p><span className="font-semibold">Deadline:</span> {module.deadline}</p>
                  <p><span className="font-semibold">Completed:</span> {module.completedBy.length}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard

