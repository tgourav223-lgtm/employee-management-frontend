// Purpose: Implements logic/UI for TrainerReviewsPage.jsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'

const TrainerReviewsPage = () => {
  const { user } = useAuth()
  const { reviews } = useTraining()
  const trainerReviews = reviews.filter((review) => review.trainerEmail === user?.email)
  const avgRating = trainerReviews.length
    ? (trainerReviews.reduce((sum, review) => sum + review.rating, 0) / trainerReviews.length).toFixed(1)
    : '0.0'
  const lowRatingCount = trainerReviews.filter((review) => review.rating <= 2).length
  const highRatingCount = trainerReviews.filter((review) => review.rating >= 4).length

  return (
    <section className=" ml-64 p-6 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="rounded-2xl border border-rose-500/30 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Reviews</h1>
          <p className="mt-1 text-sm text-slate-300">Weekly performance reviews submitted by you.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Total Reviews</p>
              <p className="text-3xl font-bold">{trainerReviews.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Avg Rating</p>
              <p className="text-3xl font-bold">{avgRating}</p>
            </div>
            <div className="rounded-xl border border-rose-700 bg-rose-600 p-4 text-rose-50">
              <p className="text-sm">Low Ratings</p>
              <p className="text-3xl font-bold">{lowRatingCount}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
          <div className="mb-4 rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-200">
            <p><span className="font-semibold">Performance Snapshot:</span> {highRatingCount} high-rated reviews and {lowRatingCount} low-rated reviews.</p>
          </div>
          <div className="space-y-3">
            {trainerReviews.length === 0 ? <p className="text-slate-300">No reviews submitted yet.</p> : null}
            {trainerReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <p><span className="font-semibold">Employee:</span> {review.employeeEmail}</p>
                <p><span className="font-semibold">Week:</span> {review.week}</p>
                <p><span className="font-semibold">Rating:</span> {review.rating}/5</p>
                <p><span className="font-semibold">Comments:</span> {review.comments}</p>
                <p><span className="font-semibold">Improvement:</span> {review.improvementAreas}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default TrainerReviewsPage


