// Purpose: Implements logic/UI for TrainerWeeklyReviewPage.jsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'
import { useToast } from '../../contexts/ToastContext'
import { hasEmailDomain, isWeekKey } from '../../utils/validation'

const getWeekKey = () => {
  const now = new Date()
  const onejan = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

const reviewDefaults = {
  employeeEmail: '',
  week: getWeekKey(),
  rating: 3,
  comments: '',
  improvementAreas: '',
}

const TrainerWeeklyReviewPage = () => {
  const { user } = useAuth()
  const { submitWeeklyReview } = useTraining()
  const { notifySuccess, notifyError } = useToast()
  const [reviewForm, setReviewForm] = useState(reviewDefaults)

  const validateReview = () => {
    if (!hasEmailDomain(reviewForm.employeeEmail, '@employee.com')) return 'Review employee must be @employee.com email.'
    if (!isWeekKey(reviewForm.week)) return 'Week format must be YYYY-Www.'

    const rating = Number(reviewForm.rating)
    if (Number.isNaN(rating) || rating < 1 || rating > 5) return 'Rating must be between 1 and 5.'
    if (reviewForm.comments.trim().length < 10) return 'Comments must be at least 10 characters.'
    if (reviewForm.improvementAreas.trim().length < 5) return 'Improvement areas must be at least 5 characters.'

    return ''
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    const error = validateReview()
    if (error) {
      notifyError(error)
      return
    }

    submitWeeklyReview({ ...reviewForm, trainerEmail: user.email })
    setReviewForm(reviewDefaults)
    notifySuccess('Weekly review submitted.')
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-rose-500/40 bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-semibold">Weekly Performance Review</h1>
        <p className="mt-1 text-sm text-slate-300">Submit weekly feedback for assigned employees.</p>
        <form className="mt-5 space-y-3" onSubmit={handleReviewSubmit}>
          <input value={reviewForm.employeeEmail} onChange={(e) => setReviewForm((p) => ({ ...p, employeeEmail: e.target.value }))} placeholder="Employee email" className="w-full rounded-xl border border-rose-500 bg-slate-950 px-3 py-2 text-white" />
          <input value={reviewForm.week} onChange={(e) => setReviewForm((p) => ({ ...p, week: e.target.value }))} placeholder="Week (YYYY-Www)" className="w-full rounded-xl border border-rose-500 bg-slate-950 px-3 py-2 text-white" />
          <input type="number" min="1" max="5" value={reviewForm.rating} onChange={(e) => setReviewForm((p) => ({ ...p, rating: e.target.value }))} placeholder="Rating 1-5" className="w-full rounded-xl border border-rose-500 bg-slate-950 px-3 py-2 text-white" />
          <textarea value={reviewForm.comments} onChange={(e) => setReviewForm((p) => ({ ...p, comments: e.target.value }))} placeholder="Comments" rows="3" className="w-full rounded-xl border border-rose-500 bg-slate-950 px-3 py-2 text-white" />
          <textarea value={reviewForm.improvementAreas} onChange={(e) => setReviewForm((p) => ({ ...p, improvementAreas: e.target.value }))} placeholder="Improvement areas" rows="3" className="w-full rounded-xl border border-rose-500 bg-slate-950 px-3 py-2 text-white" />
          <button className="w-full rounded-full bg-rose-500 py-2 font-semibold text-white">Submit Review</button>
        </form>
      </div>
    </section>
  )
}

export default TrainerWeeklyReviewPage


