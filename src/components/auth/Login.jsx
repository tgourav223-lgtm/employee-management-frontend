// Purpose: Implements logic/UI for Login.jsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { isValidEmail } from '../../utils/validation'

const Login = () => {
  const { login } = useAuth()
  const { notifyError, notifySuccess } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      const message = 'Enter a valid email address.'
      setError(message)
      notifyError(message)
      return
    }

    if (password.length < 5) {
      const message = 'Password must be at least 5 characters.'
      setError(message)
      notifyError(message)
      return
    }

    const result = login(email, password)
    if (!result.success) {
      setError(result.message)
      notifyError(result.message)
      return
    }

    notifySuccess('Login successful.')
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-8 shadow-lg shadow-emerald-900/20"
      >
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">Login</h1>
        <p className="mb-6 text-center text-sm text-emerald-300">
        Welcome to the Gourav project   Use `@employee.com`, `@trainer.com`, or `@admin.com` with password `12345`
        </p>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-emerald-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-full border border-emerald-500 bg-transparent px-5 py-3 text-white outline-none transition focus:border-emerald-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-emerald-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full rounded-full border border-emerald-500 bg-transparent px-5 py-3 text-white outline-none transition focus:border-emerald-300"
          />
        </div>

        {error ? <p className="mb-4 text-sm font-medium text-rose-300">{error}</p> : null}

        <button
          type="submit"
          className="w-full rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400"
        >
          Log In
        </button>
      </form>
    </div>
  )
}

export default Login


