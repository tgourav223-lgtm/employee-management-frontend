// Purpose: Implements logic/UI for EmployeeChecklistPage.jsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'
import { useToast } from '../../contexts/ToastContext'

const EmployeeChecklistPage = () => {
  const { user } = useAuth()
  const { onboardingRecords, toggleChecklistItem } = useTraining()
  const { notifySuccess } = useToast()

  const onboarding = onboardingRecords.find((record) => record.employeeEmail === user?.email)

  const handleChecklistToggle = (key) => {
    toggleChecklistItem(user.email, key)
    notifySuccess('Checklist updated.')
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-semibold">Onboarding Checklist</h1>
        {!onboarding ? <p className="mt-3 text-slate-300">No onboarding assigned yet.</p> : null}
        {onboarding ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-emerald-300">Department: {onboarding.department}</p>
            <p className="text-sm text-emerald-300">Trainer: {onboarding.trainerEmail}</p>
            <p className="text-sm text-emerald-300">Joining Date: {onboarding.joiningDate}</p>
            <div className="space-y-2 pt-1">
              {onboarding.checklist.map((item) => (
                <label key={item.key} className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950 p-2 text-sm text-white">
                  <input type="checkbox" checked={item.done} onChange={() => handleChecklistToggle(item.key)} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default EmployeeChecklistPage


