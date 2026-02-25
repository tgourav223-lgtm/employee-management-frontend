// Purpose: Implements logic/UI for AdminMembersPage.jsx
import React from 'react'
import { getUsers } from '../../utils/localstorage'

const AdminMembersPage = () => {
  const users = getUsers()
  const members = users.filter((entry) => entry.role !== 'admin')
  const employeeCount = members.filter((entry) => entry.role === 'employee').length
  const trainerCount = members.filter((entry) => entry.role === 'trainer').length

  return (
    <section className="  ml-64 p-6 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="rounded-2xl border border-rose-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="mt-1 text-sm text-slate-300">Employee and trainer members in your workspace.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Total Members</p>
              <p className="text-3xl font-bold">{members.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Employees</p>
              <p className="text-3xl font-bold">{employeeCount}</p>
            </div>
            <div className="rounded-xl border border-violet-700 bg-violet-600 p-4 text-violet-50">
              <p className="text-sm">Trainers</p>
              <p className="text-3xl font-bold">{trainerCount}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Directory</h2>
          <p className="mt-1 text-sm text-slate-300">Manage role distribution and team details.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {members.length === 0 ? <p className="text-slate-300">No members found.</p> : null}
            {members.map((member) => (
              <div key={member.id} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{member.name}</p>
                  <p className="inline-flex rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize">
                    {member.role}
                  </p>
                </div>
                <p className="mt-1 text-sm text-slate-300">{member.email}</p>
                <p className="mt-2 text-sm text-slate-300">{member.designation}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default AdminMembersPage


