// Purpose: Implements logic/UI for TaskListNumber.jsx
import React from 'react'
import { useTasks } from '../../contexts/TaskContext'

const TaskListNumber = () => {
  const { stats } = useTasks()

  const taskStats = [
    {
      label: 'New Task',
      value: stats.new,
      cardClass: 'border-emerald-700 bg-emerald-600 text-emerald-50',
    },
    {
      label: 'Completed',
      value: stats.completed,
      cardClass: 'border-cyan-700 bg-cyan-600 text-cyan-50',
    },
    {
      label: 'Accepted',
      value: stats.accepted,
      cardClass: 'border-amber-700 bg-amber-600 text-amber-50',
    },
    {
      label: 'Failed',
      value: stats.failed,
      cardClass: 'border-rose-700 bg-rose-600 text-rose-50',
    },
  ]

  return (
    <section className="bg-slate-950 px-4 pb-8 md:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-slate-900 p-4 md:p-6">
        <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-3 md:gap-4">
          {taskStats.map((task) => (
            <article key={task.label} className={`rounded-xl border p-4 shadow-md ${task.cardClass}`}>
              <p className="text-4xl font-bold leading-none">{task.value}</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">{task.label}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TaskListNumber


