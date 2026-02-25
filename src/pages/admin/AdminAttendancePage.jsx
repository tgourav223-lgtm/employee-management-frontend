// Purpose: Implements logic/UI for AdminAttendancePage.jsx
import React from 'react'
import { getUsers } from '../../utils/localstorage'
import { useTraining } from '../../contexts/TrainingContext'

const clampPercent = (value) => Math.max(0, Math.min(100, Math.round(value)))

const AdminAttendancePage = () => {
  const { modules, quizAttempts, reviews } = useTraining()
  const users = getUsers()
  const employees = users.filter((user) => user.role === 'employee')

  const attendanceRows = employees.map((employee) => {
    const assignedModules = modules.filter((module) => module.assignee === employee.email)
    const completedModules = assignedModules.filter((module) => module.completedBy.includes(employee.email))
    const modulePercent = assignedModules.length
      ? (completedModules.length / assignedModules.length) * 100
      : 0

    const attempts = quizAttempts.filter((attempt) => attempt.employeeEmail === employee.email)
    const passPercent = attempts.length
      ? (attempts.filter((attempt) => attempt.passed).length / attempts.length) * 100
      : 0

    const employeeReviews = reviews.filter((review) => review.employeeEmail === employee.email)
    const avgRating = employeeReviews.length
      ? (employeeReviews.reduce((sum, review) => sum + review.rating, 0) / employeeReviews.length) * 20
      : 0

    const attendance = clampPercent((modulePercent * 0.45) + (passPercent * 0.35) + (avgRating * 0.2))
    const status = attendance >= 85 ? 'Excellent' : attendance >= 65 ? 'Good' : 'Needs Attention'

    return {
      ...employee,
      attendance,
      modulePercent: clampPercent(modulePercent),
      passPercent: clampPercent(passPercent),
      avgRating: clampPercent(avgRating),
      status,
    }
  })

  const averageAttendance = attendanceRows.length
    ? clampPercent(attendanceRows.reduce((sum, row) => sum + row.attendance, 0) / attendanceRows.length)
    : 0
  const excellentCount = attendanceRows.filter((row) => row.attendance >= 85).length
  const riskCount = attendanceRows.filter((row) => row.attendance < 65).length

  return (
    <section className="  ml-64 p-6 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Attendance Analytics</h1>
          <p className="mt-1 text-sm text-slate-300">Attendance insights for all employees (modules + quiz + review signal).</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Overall Attendance</p>
              <p className="text-3xl font-bold">{averageAttendance}%</p>
            </div>
            <div className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Excellent</p>
              <p className="text-3xl font-bold">{excellentCount}</p>
            </div>
            <div className="rounded-xl border border-rose-700 bg-rose-600 p-4 text-rose-50">
              <p className="text-sm">Needs Attention</p>
              <p className="text-3xl font-bold">{riskCount}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Attendance Graph</h2>
          <div className="mt-4 space-y-4">
            {attendanceRows.length === 0 ? <p className="text-slate-300">No employee records available.</p> : null}
            {attendanceRows.map((row) => (
              <div key={row.email} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-xs text-slate-300">{row.email}</p>
                  </div>
                  <p className="text-sm font-semibold">{row.status}</p>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${row.attendance}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-200">Attendance Score: {row.attendance}%</p>

                <div className="mt-3 grid gap-2 text-xs text-slate-300 md:grid-cols-3">
                  <p>Module Completion: {row.modulePercent}%</p>
                  <p>Quiz Pass Rate: {row.passPercent}%</p>
                  <p>Review Signal: {row.avgRating}%</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default AdminAttendancePage

