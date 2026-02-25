// Purpose: Implements logic/UI for TaskSlider.jsx
import React from 'react'

const priorityStyles = {
  high: 'bg-rose-700 text-white border-rose-800',
  medium: 'bg-amber-700 text-white border-amber-800',
  low: 'bg-lime-700 text-white border-lime-800',
}

const cardStyles = ['border-emerald-900 bg-emerald-600', 'border-cyan-900 bg-cyan-600', 'border-violet-900 bg-violet-600', 'border-orange-900 bg-orange-600']

const formatDate = (dateString) => {
  if (!dateString) return 'No Date'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const TaskSlider = ({ tasks = [] }) => {
  const cards = tasks.length > 0 ? tasks.slice(0, 8) : []
  const slidingTasks = [...cards, ...cards]

  return (
    <section className="overflow-x-hidden bg-slate-950 px-4 pb-10 md:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-4 md:p-6">
        <h2 className="mb-4 text-lg font-semibold text-white md:text-xl">Task Updates</h2>

        {cards.length === 0 ? (
          <p className="text-sm text-slate-300">No tasks available yet.</p>
        ) : (
          <div className="task-slider-track flex gap-0">
            {slidingTasks.map((task, index) => {
              const priority = task.priority?.toLowerCase() || 'medium'
              const priorityClass = priorityStyles[priority] || priorityStyles.medium
              const cardClass = cardStyles[index % cardStyles.length]

              return (
                <article
                  key={`${task.id}-${index}`}
                  className={`min-h-40 w-72 shrink-0 rounded-none border p-4 shadow-md ${cardClass}`}
                >
                  <div className="mb-3 border-b border-white/30 pb-3">
                    <h3 className="text-base font-semibold text-white">{task.title}</h3>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-white">{formatDate(task.date)}</p>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClass}`}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm text-white">{task.description || 'No description available.'}</p>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default TaskSlider


