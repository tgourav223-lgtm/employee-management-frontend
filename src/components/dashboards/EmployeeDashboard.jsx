// Purpose: Implements logic/UI for EmployeeDashboard.jsx
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../shared/Header'
import AttendanceSection from '../shared/AttendanceSection'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'
import { useToast } from '../../contexts/ToastContext'
import { isHttpUrl } from '../../utils/validation'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const {
    modules,
    quizzes,
    quizAttempts,
    reviews,
    profiles,
    markModuleCompleted,
    submitAssignment,
    attemptQuiz,
  } = useTraining()
  const { notifySuccess, notifyError } = useToast()

  const employeeEmail = user?.email || ''
  const assignedModules = modules.filter((module) => module.assignee === employeeEmail)
  const assignedQuizzes = quizzes.filter((quiz) => quiz.assignee === employeeEmail)
  const employeeAttempts = quizAttempts.filter((attempt) => attempt.employeeEmail === employeeEmail)
  const employeeReviews = reviews.filter((review) => review.employeeEmail === employeeEmail)
  const profile = profiles.find((entry) => entry.email === employeeEmail)

  const [quizScores, setQuizScores] = useState({})
  const [assignmentInputs, setAssignmentInputs] = useState({})

  const progress = useMemo(() => {
    if (assignedModules.length === 0) return 0
    const completedCount = assignedModules.filter((module) => module.completedBy.includes(employeeEmail)).length
    return Math.round((completedCount / assignedModules.length) * 100)
  }, [assignedModules, employeeEmail])

  const latestFeedback = employeeReviews[0]?.comments || employeeAttempts[0]?.feedback || 'No feedback yet.'

  const handleQuizAttempt = (quiz) => {
    const rawScore = quizScores[quiz.id]
    const score = Number(rawScore)

    if (rawScore === '' || Number.isNaN(score)) {
      notifyError('Enter a valid numeric score before submitting.')
      return
    }

    if (score < 0 || score > quiz.totalMarks) {
      notifyError(`Score must be between 0 and ${quiz.totalMarks}.`)
      return
    }

    const result = attemptQuiz({ quizId: quiz.id, employeeEmail, score })
    if (!result.success) {
      notifyError(result.message)
      return
    }

    setQuizScores((prev) => ({ ...prev, [quiz.id]: '' }))
    notifySuccess('Quiz submitted successfully.')
  }

  const handleModuleCompleted = (moduleId) => {
    markModuleCompleted(moduleId, employeeEmail)
    notifySuccess('Module marked as completed.')
  }

  const handleAssignmentSubmit = (moduleId) => {
    const link = assignmentInputs[moduleId] || ''
    if (!isHttpUrl(link)) {
      notifyError('Assignment link must be a valid http/https URL.')
      return
    }

    submitAssignment(moduleId, employeeEmail, link)
    setAssignmentInputs((prev) => ({ ...prev, [moduleId]: '' }))
    notifySuccess('Assignment submitted successfully.')
  }

  return (
    <div className=" ml-64 p-6 min-h-screen bg-slate-950">
      <Header
        title="Employee Dashboard"
        subtitle={user?.designation || 'Learning Workspace'}
        userName={user?.name}
        
        accent="emerald"
      />

      <section className="bg-slate-950 px-4 pb-10 pt-2 md:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-emerald-700 bg-emerald-600 p-4 text-emerald-50">
              <p className="text-sm">Course Progress</p>
              <h3 className="text-3xl font-bold">{progress}%</h3>
            </article>
            <article className="rounded-xl border border-cyan-700 bg-cyan-600 p-4 text-cyan-50">
              <p className="text-sm">Quiz Attempts</p>
              <h3 className="text-3xl font-bold">{employeeAttempts.length}</h3>
            </article>
            <article className="rounded-xl border border-violet-700 bg-violet-600 p-4 text-violet-50">
              <p className="text-sm">Latest Feedback</p>
              <h3 className="text-sm font-semibold">{latestFeedback}</h3>
            </article>
          </div>

          <AttendanceSection role="employee" />

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-semibold text-white">Profile Card</h3>
            <div className="grid gap-4 md:grid-cols-[120px_1fr]">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-cyan-500/40 bg-slate-950 text-3xl font-bold text-cyan-300">
                {user?.name?.slice(0, 1) || 'U'}
              </div>
              <div className="space-y-2 text-sm text-slate-200">
                <p><span className="font-semibold text-white">Name:</span> {user?.name || 'N/A'}</p>
                <p><span className="font-semibold text-white">Email:</span> {user?.email || 'N/A'}</p>
                <p><span className="font-semibold text-white">Designation:</span> {user?.designation || 'Employee'}</p>
                <p><span className="font-semibold text-white">Phone:</span> {profile?.phone || 'Not updated'}</p>
                <p><span className="font-semibold text-white">Location:</span> {profile?.location || 'Not updated'}</p>
                <p><span className="font-semibold text-white">Bio:</span> {profile?.bio || 'No bio yet.'}</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-semibold text-white">Quick Actions</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <Link to="/employee/checklist" className="rounded-xl border border-emerald-500/40 bg-slate-950 p-4 text-white transition hover:bg-slate-800">
                <p className="font-semibold">Onboarding Checklist</p>
                <p className="mt-1 text-sm text-slate-300">Track and complete onboarding checklist items.</p>
              </Link>
              <Link to="/employee/profile" className="rounded-xl border border-cyan-500/40 bg-slate-950 p-4 text-white transition hover:bg-slate-800">
                <p className="font-semibold">Update Profile</p>
                <p className="mt-1 text-sm text-slate-300">Edit phone, location, and bio information.</p>
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="mb-4 text-xl font-semibold text-white">Assigned Training Modules</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {assignedModules.length === 0 ? <p className="text-slate-300">No modules assigned.</p> : null}
              {assignedModules.map((module) => {
                const isCompleted = module.completedBy.includes(employeeEmail)
                return (
                  <div key={module.id} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-sm text-white">
                    <p className="font-semibold">{module.title}</p>
                    <p>Material: {module.materialType}</p>
                    <a className="text-emerald-300" href={module.material} target="_blank" rel="noreferrer">Open Material</a>
                    <p>Deadline: {module.deadline}</p>
                    <p>Status: {isCompleted ? 'Completed' : 'Pending'}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => handleModuleCompleted(module.id)} className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-900">
                        Mark Completed
                      </button>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={assignmentInputs[module.id] || ''}
                        onChange={(e) => setAssignmentInputs((prev) => ({ ...prev, [module.id]: e.target.value }))}
                        placeholder="Assignment link"
                        className="w-full rounded-lg border border-white/20 bg-slate-900 px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleAssignmentSubmit(module.id)}
                        className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-slate-900"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </article>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-amber-500/40 bg-slate-900 p-5">
              <h3 className="mb-4 text-xl font-semibold text-white">Assessment & Quiz</h3>
              <div className="space-y-3">
                {assignedQuizzes.length === 0 ? <p className="text-slate-300">No quizzes assigned.</p> : null}
                {assignedQuizzes.map((quiz) => (
                  <div key={quiz.id} className="rounded-lg border border-white/10 bg-slate-950 p-3 text-sm text-white">
                    <p className="font-semibold">{quiz.title}</p>
                    <p>Time Limit: {quiz.timeLimit} min</p>
                    <p>Passing Score: {quiz.passingScore}</p>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        value={quizScores[quiz.id] || ''}
                        onChange={(e) => setQuizScores((prev) => ({ ...prev, [quiz.id]: e.target.value }))}
                        placeholder="Enter score"
                        className="w-full rounded-lg border border-white/20 bg-slate-900 px-2 py-1"
                      />
                      <button onClick={() => handleQuizAttempt(quiz)} className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-900">
                        Attempt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-violet-500/40 bg-slate-900 p-5">
              <h3 className="mb-4 text-xl font-semibold text-white">Score History & Feedback</h3>
              <div className="space-y-2 text-sm text-slate-200">
                {employeeAttempts.length === 0 ? <p>No quiz results yet.</p> : null}
                {employeeAttempts.map((attempt) => (
                  <div key={attempt.id} className="rounded-lg border border-white/10 bg-slate-950 p-2">
                    <p>Quiz: {attempt.quizId}</p>
                    <p>Score: {attempt.score}</p>
                    <p>Result: {attempt.passed ? 'Pass' : 'Fail'}</p>
                    <p>Feedback: {attempt.feedback}</p>
                  </div>
                ))}
                {employeeReviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-white/10 bg-slate-950 p-2">
                    <p>Weekly Rating: {review.rating}/5</p>
                    <p>Comments: {review.comments}</p>
                    <p>Improvement: {review.improvementAreas}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EmployeeDashboard

