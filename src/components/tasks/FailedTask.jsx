// Purpose: Implements logic/UI for FailedTask.jsx
import React from 'react'

const formatDate = (dateString) => {
  if (!dateString) return 'No Date'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const FailedTask = ({ tasks = [] }) => {
  return (
    <article className="rounded-2xl border border-rose-700 bg-rose-600 p-4 text-rose-50 shadow-md">
      <h3 className="mb-3 text-lg font-semibold">Failed Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm">No failed tasks.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.slice(0, 3).map((task) => (
            <li key={task.id} className="rounded-lg border border-rose-800 bg-rose-700 p-3">
              <p className="font-semibold">{task.title}</p>
              <p className="text-xs">{formatDate(task.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default FailedTask


