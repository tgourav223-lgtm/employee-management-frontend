// Purpose: Implements logic/UI for TrainerModulesPage.jsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'

const TrainerModulesPage = () => {
  const { user } = useAuth()
  const { modules, quizzes } = useTraining()
  const trainerModules = modules.filter((module) => module.trainerEmail === user?.email)
  const linkedQuizCount = trainerModules.filter((module) => module.quizId).length
  const completionCount = trainerModules.reduce((acc, module) => acc + module.completedBy.length, 0)
  const avgCompletion = trainerModules.length ? Math.round(completionCount / trainerModules.length) : 0

  return (
    <section className=" ml-64 p-6 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Modules</h1>
          <p className="mt-1 text-sm text-slate-300">Training modules created by you.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Your Modules</p>
              <p className="text-3xl font-bold">{trainerModules.length}</p>
            </div>
            <div className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Linked Quizzes</p>
              <p className="text-3xl font-bold">{linkedQuizCount}</p>
            </div>
            <div className="rounded-xl border border-violet-700 bg-violet-600 p-4 text-violet-50">
              <p className="text-sm">Avg Completion</p>
              <p className="text-3xl font-bold">{avgCompletion}</p>
            </div>
            <div className="rounded-xl border border-amber-700 bg-amber-600 p-4 text-amber-50">
              <p className="text-sm">Total Quizzes</p>
              <p className="text-3xl font-bold">{quizzes.length}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Module List</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {trainerModules.length === 0 ? <p className="text-slate-300">No modules created yet.</p> : null}
            {trainerModules.map((module) => (
              <div key={module.id} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <p className="font-semibold">{module.title}</p>
                <p className="mt-1 text-sm text-slate-300">Assignee: {module.assignee}</p>
                <p className="text-sm text-slate-300">Deadline: {module.deadline}</p>
                <p className="text-sm text-slate-300">Type: {module.materialType}</p>
                <p className="text-sm text-slate-300">Completed By: {module.completedBy.length}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default TrainerModulesPage


