// Purpose: Implements logic/UI for AcceptTask.jsx
import React from 'react'

const formatDate = (dateString) => {
  if (!dateString) return 'No Date'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const AcceptTask = ({ tasks = [] }) => {
  return (
    <article className="rounded-2xl border border-amber-700 bg-amber-600 p-4 text-amber-50 shadow-md">
      <h3 className="mb-3 text-lg font-semibold">Accepted Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm">No accepted tasks.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.slice(0, 3).map((task) => (
            <li key={task.id} className="rounded-lg border border-amber-800 bg-amber-700 p-3">
              <p className="font-semibold">{task.title}</p>
              <p className="text-xs">{formatDate(task.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default AcceptTask


