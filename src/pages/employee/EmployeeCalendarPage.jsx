// Purpose: Implements logic/UI for EmployeeCalendarPage.jsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'

const EmployeeCalendarPage = () => {
  const { user } = useAuth()
  const { onboardingRecords, modules } = useTraining()

  const employeeEmail = user?.email || ''
  const onboarding = onboardingRecords.find((record) => record.employeeEmail === employeeEmail)
  const upcomingModules = modules.filter((module) => module.assignee === employeeEmail)
  const nextDeadline = upcomingModules
    .slice()
    .sort((a, b) => (a.deadline > b.deadline ? 1 : -1))[0]

  return (
    <section className=" ml-64 p-6 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="rounded-2xl border border-amber-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="mt-1 text-sm text-slate-300">Important onboarding and module dates.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-amber-700 bg-amber-600 p-4 text-amber-50">
              <p className="text-sm">Module Deadlines</p>
              <p className="text-3xl font-bold">{upcomingModules.length}</p>
            </div>
            <div className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Onboarding</p>
              <p className="text-3xl font-bold">{onboarding ? '1' : '0'}</p>
            </div>
            <div className="rounded-xl border border-violet-700 bg-violet-600 p-4 text-violet-50">
              <p className="text-sm">Next Deadline</p>
              <p className="text-sm font-semibold">{nextDeadline ? nextDeadline.deadline : 'N/A'}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <h2 className="text-lg font-semibold">Onboarding</h2>
              {!onboarding ? <p className="mt-2 text-slate-300">No onboarding assigned yet.</p> : null}
              {onboarding ? (
                <div className="mt-2 text-sm text-slate-200">
                  <p><span className="font-semibold">Joining Date:</span> {onboarding.joiningDate}</p>
                  <p><span className="font-semibold">Trainer:</span> {onboarding.trainerEmail}</p>
                  <p><span className="font-semibold">Duration:</span> {onboarding.trainingDurationWeeks} weeks</p>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <h2 className="text-lg font-semibold">Module Deadlines</h2>
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                {upcomingModules.length === 0 ? <p className="text-slate-300">No module deadlines.</p> : null}
                {upcomingModules.map((module) => (
                  <p key={module.id}>
                    <span className="font-semibold">{module.title}</span> - {module.deadline}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default EmployeeCalendarPage


