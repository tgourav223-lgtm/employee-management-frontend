// Purpose: Implements logic/UI for ToastContext.js
import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext(null)

const toastClassByType = {
  success: 'border-emerald-600 bg-emerald-500 text-slate-900',
  error: 'border-rose-700 bg-rose-600 text-white',
  info: 'border-cyan-700 bg-cyan-600 text-slate-900',
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const notifySuccess = (message) => addToast(message, 'success')
  const notifyError = (message) => addToast(message, 'error')
  const notifyInfo = (message) => addToast(message, 'info')

  const value = { addToast, notifySuccess, notifyError, notifyInfo }

  return React.createElement(
    ToastContext.Provider,
    { value },
    children,
    React.createElement(
      'div',
      {
        className: 'pointer-events-none fixed right-4 top-4 z-50 flex w-80 max-w-[92vw] flex-col gap-2',
      },
      toasts.map((toast) =>
        React.createElement(
          'div',
          {
            key: toast.id,
            className: `pointer-events-auto rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
              toastClassByType[toast.type] || toastClassByType.info
            }`,
          },
          toast.message,
        ),
      ),
    ),
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}


