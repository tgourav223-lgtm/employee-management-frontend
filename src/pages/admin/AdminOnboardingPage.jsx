// Purpose: Implements logic/UI for AdminOnboardingPage.jsx
import React from 'react'
import { useTraining } from '../../contexts/TrainingContext'

const AdminOnboardingPage = () => {
  const { onboardingRecords } = useTraining()
  const completedChecklists = onboardingRecords.filter((record) =>
    (record.checklist || []).every((item) => item.done),
  ).length

  return (
    <section className="  ml-64 p-6 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Onboarding</h1>
          <p className="mt-1 text-sm text-slate-300">Track joining, trainers, and onboarding progress.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Total Records</p>
              <p className="text-3xl font-bold">{onboardingRecords.length}</p>
            </div>
            <div className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Checklist Complete</p>
              <p className="text-3xl font-bold">{completedChecklists}</p>
            </div>
            <div className="rounded-xl border border-amber-700 bg-amber-600 p-4 text-amber-50">
              <p className="text-sm">In Progress</p>
              <p className="text-3xl font-bold">{Math.max(onboardingRecords.length - completedChecklists, 0)}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Onboarding Queue</h2>
          <div className="mt-4 space-y-3">
            {onboardingRecords.length === 0 ? <p className="text-slate-300">No onboarding records found.</p> : null}
            {onboardingRecords.map((record) => {
              const checklist = record.checklist || []
              const doneCount = checklist.filter((item) => item.done).length
              const totalCount = checklist.length
              return (
                <div key={record.id} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p><span className="font-semibold">Employee:</span> {record.employeeEmail}</p>
                  <p><span className="font-semibold">Department:</span> {record.department}</p>
                  <p><span className="font-semibold">Trainer:</span> {record.trainerEmail}</p>
                  <p><span className="font-semibold">Joining:</span> {record.joiningDate}</p>
                  <p><span className="font-semibold">Duration:</span> {record.trainingDurationWeeks} weeks</p>
                  <p><span className="font-semibold">Checklist:</span> {doneCount}/{totalCount}</p>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

export default AdminOnboardingPage


