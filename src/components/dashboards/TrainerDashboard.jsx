// Purpose: Implements logic/UI for TrainerDashboard.jsx
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../shared/Header'
import AttendanceSection from '../shared/AttendanceSection'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'

const getWeekKey = () => {
  const now = new Date()
  const onejan = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

const TrainerDashboard = () => {
  const { user } = useAuth()
  const { onboardingRecords, quizzes, quizAttempts, reviews } = useTraining()

  const assignedTrainees = useMemo(() => {
    const set = new Set(
      onboardingRecords
        .filter((record) => record.trainerEmail === user.email)
        .map((record) => record.employeeEmail),
    )
    return Array.from(set)
  }, [onboardingRecords, user.email])

  const trainerQuizIds = quizzes.filter((quiz) => quiz.trainerEmail === user.email).map((quiz) => quiz.id)
  const trainerAttempts = quizAttempts.filter((attempt) => trainerQuizIds.includes(attempt.quizId))
  const avgScore = trainerAttempts.length
    ? Math.round(trainerAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / trainerAttempts.length)
    : 0

  const currentWeek = getWeekKey()
  const reviewedThisWeek = new Set(
    reviews
      .filter((review) => review.trainerEmail === user.email && review.week === currentWeek)
      .map((review) => review.employeeEmail),
  )
  const pendingReviews = assignedTrainees.filter((email) => !reviewedThisWeek.has(email))

  return (
    <div className=" ml-64 p-6 min-h-screen bg-slate-950">
      <Header
        title="Trainer Dashboard"
        subtitle={user?.designation || 'Training Workspace'}
        userName={user?.name}
        
        accent="emerald"
      />

      <section className="bg-slate-950 px-4 pb-10 pt-2 md:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Assigned Trainees</p>
              <h3 className="text-3xl font-bold">{assignedTrainees.length}</h3>
            </article>
            <article className="rounded-xl border border-amber-700 bg-amber-600 p-4 text-amber-50">
              <p className="text-sm">Pending Reviews</p>
              <h3 className="text-3xl font-bold">{pendingReviews.length}</h3>
            </article>
            <article className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Quiz Avg Score</p>
              <h3 className="text-3xl font-bold">{avgScore}</h3>
            </article>
          </div>

          <AttendanceSection role="trainer" />

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-semibold text-white">Quick Actions</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <Link to="/trainer/create-module" className="rounded-xl border border-emerald-500/40 bg-slate-950 p-4 text-white transition hover:bg-slate-800">
                <p className="font-semibold">Create Module</p>
                <p className="mt-1 text-sm text-slate-300">Assign new training modules.</p>
              </Link>
              <Link to="/trainer/create-quiz" className="rounded-xl border border-cyan-500/40 bg-slate-950 p-4 text-white transition hover:bg-slate-800">
                <p className="font-semibold">Create Quiz</p>
                <p className="mt-1 text-sm text-slate-300">Set assessments for trainees.</p>
              </Link>
              <Link to="/trainer/weekly-review" className="rounded-xl border border-rose-500/40 bg-slate-950 p-4 text-white transition hover:bg-slate-800">
                <p className="font-semibold">Weekly Review</p>
                <p className="mt-1 text-sm text-slate-300">Submit weekly performance feedback.</p>
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="mb-3 text-xl font-semibold text-white">Pending Reviews List</h3>
            {pendingReviews.length === 0 ? <p className="text-slate-300">No pending reviews for this week.</p> : null}
            <ul className="space-y-2 text-sm text-slate-200">
              {pendingReviews.map((email) => (
                <li key={email} className="rounded-lg border border-white/10 bg-slate-950 p-2">{email}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}

export default TrainerDashboard

