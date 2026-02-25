// Purpose: Implements logic/UI for EmployeeTasksPage.jsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTasks } from '../../contexts/TaskContext'

const EmployeeTasksPage = () => {
  const { user } = useAuth()
  const { tasks } = useTasks()
  const myTasks = tasks.filter((task) => task.assignee === user?.email)
  const newCount = myTasks.filter((task) => task.status === 'new').length
  const progressCount = myTasks.filter((task) => task.status === 'accepted').length
  const doneCount = myTasks.filter((task) => task.status === 'completed').length

  return (
    <section className=" ml-64 p-6 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="mt-1 text-sm text-slate-300">All tasks assigned to you.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">New</p>
              <p className="text-3xl font-bold">{newCount}</p>
            </div>
            <div className="rounded-xl border border-amber-700 bg-amber-600 p-4 text-amber-50">
              <p className="text-sm">In Progress</p>
              <p className="text-3xl font-bold">{progressCount}</p>
            </div>
            <div className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Completed</p>
              <p className="text-3xl font-bold">{doneCount}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Task Board</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {myTasks.length === 0 ? <p className="text-slate-300">No assigned tasks.</p> : null}
            {myTasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <p className="font-semibold">{task.title}</p>
                <p className="mt-1 text-sm text-slate-300">{task.description}</p>
                <div className="mt-2 space-y-1 text-sm text-slate-200">
                  <p><span className="font-semibold">Date:</span> {task.date}</p>
                  <p><span className="font-semibold">Priority:</span> {task.priority}</p>
                  <p><span className="font-semibold">Status:</span> {task.status}</p>
                  <p><span className="font-semibold">Category:</span> {task.category}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default EmployeeTasksPage


