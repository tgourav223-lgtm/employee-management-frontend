// Purpose: Implements logic/UI for TaskContext.js
import React, { createContext, useContext, useMemo, useState } from 'react'
import { getTasks, saveTasks } from '../utils/localstorage'

const TaskContext = createContext(null)

const normalizePriority = (value) => {
  const priority = value.trim().toLowerCase()
  if (priority === 'high' || priority === 'medium' || priority === 'low') return priority
  return 'medium'
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => getTasks())

  const persistTasks = (nextTasks) => {
    setTasks(nextTasks)
    saveTasks(nextTasks)
  }

  const addTask = (taskInput) => {
    const newTask = {
      id: `t-${Date.now()}`,
      title: taskInput.title.trim(),
      description: taskInput.description.trim(),
      date: taskInput.date,
      priority: normalizePriority(taskInput.priority || 'medium'),
      status: 'new',
      assignee: taskInput.assignee.trim().toLowerCase(),
      category: taskInput.category.trim(),
    }

    const nextTasks = [newTask, ...tasks]
    persistTasks(nextTasks)
    return newTask
  }

  const updateTaskStatus = (taskId, status) => {
    const nextTasks = tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
    persistTasks(nextTasks)
  }

  const tasksByStatus = useMemo(
    () => ({
      new: tasks.filter((task) => task.status === 'new'),
      accepted: tasks.filter((task) => task.status === 'accepted'),
      completed: tasks.filter((task) => task.status === 'completed'),
      failed: tasks.filter((task) => task.status === 'failed'),
    }),
    [tasks],
  )

  const stats = useMemo(
    () => ({
      new: tasksByStatus.new.length,
      accepted: tasksByStatus.accepted.length,
      completed: tasksByStatus.completed.length,
      failed: tasksByStatus.failed.length,
    }),
    [tasksByStatus],
  )

  const value = {
    tasks,
    tasksByStatus,
    stats,
    addTask,
    updateTaskStatus,
  }

  return React.createElement(TaskContext.Provider, { value }, children)
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider')
  }
  return context
}


