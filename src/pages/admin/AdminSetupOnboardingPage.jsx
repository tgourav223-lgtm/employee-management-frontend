// Purpose: Implements logic/UI for AdminSetupOnboardingPage.jsx
import React, { useState } from 'react'
import { useTraining } from '../../contexts/TrainingContext'
import { useToast } from '../../contexts/ToastContext'
import { getUsers } from '../../utils/localstorage'
import { hasEmailDomain, todayISO } from '../../utils/validation'

const onboardingDefaults = {
  employeeEmail: '',
  department: '',
  trainerEmail: '',
  trainingDurationWeeks: '',
  joiningDate: '',
}

const AdminSetupOnboardingPage = () => {
  const { upsertOnboardingRecord } = useTraining()
  const { notifySuccess, notifyError } = useToast()
  const [onboardingForm, setOnboardingForm] = useState(onboardingDefaults)

  const users = getUsers()
  const employees = users.filter((entry) => entry.role === 'employee')
  const trainers = users.filter((entry) => entry.role === 'trainer')

  const onOnboardingInput = (field, value) => {
    setOnboardingForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateOnboardingForm = () => {
    const { employeeEmail, department, trainerEmail, trainingDurationWeeks, joiningDate } = onboardingForm
    if (!employeeEmail || !department || !trainerEmail || !trainingDurationWeeks || !joiningDate) {
      return 'Fill all onboarding fields.'
    }
    if (!hasEmailDomain(employeeEmail, '@employee.com')) return 'Employee email must end with @employee.com.'
    if (!hasEmailDomain(trainerEmail, '@trainer.com')) return 'Trainer email must end with @trainer.com.'

    const duration = Number(trainingDurationWeeks)
    if (Number.isNaN(duration) || duration < 1 || duration > 52) {
      return 'Training duration must be between 1 and 52 weeks.'
    }
    if (joiningDate > todayISO()) return 'Joining date cannot be in the future.'
    return ''
  }

  const handleOnboardingSubmit = (e) => {
    e.preventDefault()
    const validationError = validateOnboardingForm()
    if (validationError) {
      notifyError(validationError)
      return
    }

    upsertOnboardingRecord(onboardingForm)
    setOnboardingForm(onboardingDefaults)
    notifySuccess('Onboarding assigned/updated successfully.')
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-semibold">Employee Onboarding Setup</h1>
        <form className="mt-5 space-y-4" onSubmit={handleOnboardingSubmit}>
          <select value={onboardingForm.employeeEmail} onChange={(e) => onOnboardingInput('employeeEmail', e.target.value)} className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-4 py-3 text-white outline-none">
            <option value="">Select Employee</option>
            {employees.map((entry) => (
              <option key={entry.email} value={entry.email}>{entry.email}</option>
            ))}
          </select>
          <input value={onboardingForm.department} onChange={(e) => onOnboardingInput('department', e.target.value)} placeholder="Department" className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-4 py-3 text-white outline-none" />
          <select value={onboardingForm.trainerEmail} onChange={(e) => onOnboardingInput('trainerEmail', e.target.value)} className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-4 py-3 text-white outline-none">
            <option value="">Assign Trainer</option>
            {trainers.map((entry) => (
              <option key={entry.email} value={entry.email}>{entry.email}</option>
            ))}
          </select>
          <input type="number" value={onboardingForm.trainingDurationWeeks} onChange={(e) => onOnboardingInput('trainingDurationWeeks', e.target.value)} placeholder="Training duration (weeks)" className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-4 py-3 text-white outline-none" />
          <input type="date" value={onboardingForm.joiningDate} onChange={(e) => onOnboardingInput('joiningDate', e.target.value)} className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-4 py-3 text-white outline-none" />
          <button type="submit" className="w-full rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400">Save Onboarding</button>
        </form>
      </div>
    </section>
  )
}

export default AdminSetupOnboardingPage


