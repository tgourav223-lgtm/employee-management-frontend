// Purpose: Implements logic/UI for AttendanceSection.jsx
import React from 'react'

const AttendanceSection = ({ role = 'employee' }) => {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <h3 className="mb-4 text-xl font-semibold text-white">Attendance</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-cyan-500/40 bg-slate-950 p-4 text-white">
          <p className="text-sm text-slate-300">Today</p>
          <p className="text-lg font-semibold">{formattedDate}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-4 text-white">
          <p className="text-sm text-slate-300">Status</p>
          <p className="text-lg font-semibold">Present</p>
        </div>
        <div className="rounded-xl border border-violet-500/40 bg-slate-950 p-4 text-white">
          <p className="text-sm text-slate-300">Role</p>
          <p className="text-lg font-semibold">{roleLabel}</p>
        </div>
      </div>
    </article>
  )
}

export default AttendanceSection

