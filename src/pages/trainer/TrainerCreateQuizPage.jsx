// Purpose: Implements logic/UI for TrainerCreateQuizPage.jsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'
import { useToast } from '../../contexts/ToastContext'
import { hasEmailDomain } from '../../utils/validation'

const quizDefaults = {
  title: '',
  assignee: '',
  timeLimit: '',
  passingScore: '',
  totalMarks: 100,
  questions: 10,
}

const TrainerCreateQuizPage = () => {
  const { user } = useAuth()
  const { createQuiz } = useTraining()
  const { notifySuccess, notifyError } = useToast()
  const [quizForm, setQuizForm] = useState(quizDefaults)

  const validateQuiz = () => {
    if (!quizForm.title || quizForm.title.trim().length < 3) return 'Quiz title must be at least 3 characters.'
    if (!hasEmailDomain(quizForm.assignee, '@employee.com')) return 'Quiz assignee must be an @employee.com email.'

    const timeLimit = Number(quizForm.timeLimit)
    const passingScore = Number(quizForm.passingScore)
    const totalMarks = Number(quizForm.totalMarks)
    const questions = Number(quizForm.questions)

    if (Number.isNaN(timeLimit) || timeLimit < 5 || timeLimit > 180) return 'Time limit must be 5-180 minutes.'
    if (Number.isNaN(passingScore) || passingScore < 0 || passingScore > 100) return 'Passing score must be 0-100.'
    if (Number.isNaN(totalMarks) || totalMarks <= 0) return 'Total marks must be greater than 0.'
    if (Number.isNaN(questions) || questions < 1 || questions > 100) return 'Questions must be between 1 and 100.'

    return ''
  }

  const handleQuizSubmit = (e) => {
    e.preventDefault()
    const error = validateQuiz()
    if (error) {
      notifyError(error)
      return
    }

    createQuiz({ ...quizForm, trainerEmail: user.email })
    setQuizForm(quizDefaults)
    notifySuccess('Quiz created successfully.')
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-semibold">Create MCQ Quiz</h1>
        <p className="mt-1 text-sm text-slate-300">Create a quiz and assign it to an employee.</p>
        <form className="mt-5 space-y-3" onSubmit={handleQuizSubmit}>
          <input value={quizForm.title} onChange={(e) => setQuizForm((p) => ({ ...p, title: e.target.value }))} placeholder="Quiz title" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <input value={quizForm.assignee} onChange={(e) => setQuizForm((p) => ({ ...p, assignee: e.target.value }))} placeholder="Employee email" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <input type="number" value={quizForm.timeLimit} onChange={(e) => setQuizForm((p) => ({ ...p, timeLimit: e.target.value }))} placeholder="Time limit (min)" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <input type="number" value={quizForm.passingScore} onChange={(e) => setQuizForm((p) => ({ ...p, passingScore: e.target.value }))} placeholder="Passing score" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <input type="number" value={quizForm.totalMarks} onChange={(e) => setQuizForm((p) => ({ ...p, totalMarks: e.target.value }))} placeholder="Total marks" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <input type="number" value={quizForm.questions} onChange={(e) => setQuizForm((p) => ({ ...p, questions: e.target.value }))} placeholder="Number of MCQs" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <button className="w-full rounded-full bg-cyan-500 py-2 font-semibold text-slate-900">Create Quiz</button>
        </form>
      </div>
    </section>
  )
}

export default TrainerCreateQuizPage


