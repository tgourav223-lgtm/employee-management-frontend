// Purpose: Implements logic/UI for TrainerCreateModulePage.jsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'
import { useToast } from '../../contexts/ToastContext'
import { hasEmailDomain, isHttpUrl, todayISO } from '../../utils/validation'

const moduleDefaults = {
  title: '',
  material: '',
  materialType: 'PDF',
  deadline: '',
  assignee: '',
  quizId: '',
}

const TrainerCreateModulePage = () => {
  const { user } = useAuth()
  const { createTrainingModule } = useTraining()
  const { notifySuccess, notifyError } = useToast()
  const [moduleForm, setModuleForm] = useState(moduleDefaults)

  const validateModule = () => {
    if (!moduleForm.title || moduleForm.title.trim().length < 3) return 'Module title must be at least 3 characters.'
    if (!isHttpUrl(moduleForm.material)) return 'Material must be a valid http/https URL.'
    if (!moduleForm.deadline) return 'Deadline is required.'
    if (moduleForm.deadline < todayISO()) return 'Deadline cannot be in the past.'
    if (!hasEmailDomain(moduleForm.assignee, '@employee.com')) return 'Assignee must be an @employee.com email.'
    return ''
  }

  const handleModuleSubmit = (e) => {
    e.preventDefault()
    const error = validateModule()
    if (error) {
      notifyError(error)
      return
    }

    createTrainingModule({ ...moduleForm, trainerEmail: user.email })
    setModuleForm(moduleDefaults)
    notifySuccess('Training module created and assigned.')
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-semibold">Create Training Module</h1>
        <p className="mt-1 text-sm text-slate-300">Create and assign a module to employee onboarding.</p>
        <form className="mt-5 space-y-3" onSubmit={handleModuleSubmit}>
          <input value={moduleForm.title} onChange={(e) => setModuleForm((p) => ({ ...p, title: e.target.value }))} placeholder="Module title" className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-3 py-2 text-white" />
          <input value={moduleForm.material} onChange={(e) => setModuleForm((p) => ({ ...p, material: e.target.value }))} placeholder="PDF/Video link" className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-3 py-2 text-white" />
          <select value={moduleForm.materialType} onChange={(e) => setModuleForm((p) => ({ ...p, materialType: e.target.value }))} className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-3 py-2 text-white">
            <option value="PDF">PDF</option>
            <option value="Video">Video</option>
          </select>
          <input type="date" value={moduleForm.deadline} onChange={(e) => setModuleForm((p) => ({ ...p, deadline: e.target.value }))} className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-3 py-2 text-white" />
          <input value={moduleForm.assignee} onChange={(e) => setModuleForm((p) => ({ ...p, assignee: e.target.value }))} placeholder="Assign to (email)" className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-3 py-2 text-white" />
          <input value={moduleForm.quizId} onChange={(e) => setModuleForm((p) => ({ ...p, quizId: e.target.value }))} placeholder="Attach quiz id (optional)" className="w-full rounded-xl border border-emerald-500 bg-slate-950 px-3 py-2 text-white" />
          <button className="w-full rounded-full bg-emerald-500 py-2 font-semibold text-slate-900">Create Module</button>
        </form>
      </div>
    </section>
  )
}

export default TrainerCreateModulePage


