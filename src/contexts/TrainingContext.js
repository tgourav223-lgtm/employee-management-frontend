// Purpose: Implements logic/UI for TrainingContext.js
import React, { createContext, useContext, useState } from 'react'
import {
  getModules,
  getOnboarding,
  getProfiles,
  getQuizAttempts,
  getQuizzes,
  getReviews,
  saveModules,
  saveOnboarding,
  saveProfiles,
  saveQuizAttempts,
  saveQuizzes,
  saveReviews,
} from '../utils/localstorage'

const TrainingContext = createContext(null)

const defaultChecklist = [
  { key: 'docs', label: 'Document Verification', done: false },
  { key: 'tools', label: 'Tools Setup', done: false },
  { key: 'policy', label: 'Policy Orientation', done: false },
  { key: 'mentor', label: 'Mentor Introduction', done: false },
]

export const TrainingProvider = ({ children }) => {
  const [onboardingRecords, setOnboardingRecords] = useState(() => getOnboarding())
  const [modules, setModules] = useState(() => getModules())
  const [quizzes, setQuizzes] = useState(() => getQuizzes())
  const [quizAttempts, setQuizAttempts] = useState(() => getQuizAttempts())
  const [reviews, setReviews] = useState(() => getReviews())
  const [profiles, setProfiles] = useState(() => getProfiles())

  const upsertOnboardingRecord = (record) => {
    const normalizedEmail = record.employeeEmail.trim().toLowerCase()
    const existing = onboardingRecords.find((item) => item.employeeEmail === normalizedEmail)

    const nextRecord = {
      id: existing?.id || `ob-${Date.now()}`,
      employeeEmail: normalizedEmail,
      department: record.department.trim(),
      trainerEmail: record.trainerEmail.trim().toLowerCase(),
      trainingDurationWeeks: Number(record.trainingDurationWeeks || 0),
      joiningDate: record.joiningDate,
      checklist: existing?.checklist?.length ? existing.checklist : defaultChecklist,
    }

    const nextRecords = existing
      ? onboardingRecords.map((item) => (item.employeeEmail === normalizedEmail ? nextRecord : item))
      : [nextRecord, ...onboardingRecords]

    setOnboardingRecords(nextRecords)
    saveOnboarding(nextRecords)
  }

  const toggleChecklistItem = (employeeEmail, key) => {
    const normalizedEmail = employeeEmail.toLowerCase()
    const nextRecords = onboardingRecords.map((record) => {
      if (record.employeeEmail !== normalizedEmail) return record
      return {
        ...record,
        checklist: record.checklist.map((item) =>
          item.key === key ? { ...item, done: !item.done } : item,
        ),
      }
    })

    setOnboardingRecords(nextRecords)
    saveOnboarding(nextRecords)
  }

  const updateEmployeeProfile = (email, profileInput) => {
    const normalizedEmail = email.trim().toLowerCase()
    const nextProfile = {
      email: normalizedEmail,
      phone: profileInput.phone?.trim() || '',
      location: profileInput.location?.trim() || '',
      bio: profileInput.bio?.trim() || '',
    }

    const exists = profiles.some((profile) => profile.email === normalizedEmail)
    const nextProfiles = exists
      ? profiles.map((profile) => (profile.email === normalizedEmail ? nextProfile : profile))
      : [nextProfile, ...profiles]

    setProfiles(nextProfiles)
    saveProfiles(nextProfiles)
  }

  const createTrainingModule = (moduleInput) => {
    const newModule = {
      id: `m-${Date.now()}`,
      title: moduleInput.title.trim(),
      material: moduleInput.material.trim(),
      materialType: moduleInput.materialType,
      deadline: moduleInput.deadline,
      quizId: moduleInput.quizId || '',
      assignee: moduleInput.assignee.trim().toLowerCase(),
      trainerEmail: moduleInput.trainerEmail.trim().toLowerCase(),
      completedBy: [],
      submissions: {},
    }

    const nextModules = [newModule, ...modules]
    setModules(nextModules)
    saveModules(nextModules)
  }

  const markModuleCompleted = (moduleId, employeeEmail) => {
    const normalizedEmail = employeeEmail.toLowerCase()
    const nextModules = modules.map((module) => {
      if (module.id !== moduleId) return module
      if (module.completedBy.includes(normalizedEmail)) return module
      return {
        ...module,
        completedBy: [...module.completedBy, normalizedEmail],
      }
    })

    setModules(nextModules)
    saveModules(nextModules)
  }

  const submitAssignment = (moduleId, employeeEmail, assignmentLink) => {
    const normalizedEmail = employeeEmail.toLowerCase()
    const nextModules = modules.map((module) => {
      if (module.id !== moduleId) return module
      return {
        ...module,
        submissions: {
          ...module.submissions,
          [normalizedEmail]: assignmentLink.trim(),
        },
      }
    })

    setModules(nextModules)
    saveModules(nextModules)
  }

  const createQuiz = (quizInput) => {
    const newQuiz = {
      id: `q-${Date.now()}`,
      title: quizInput.title.trim(),
      assignee: quizInput.assignee.trim().toLowerCase(),
      trainerEmail: quizInput.trainerEmail.trim().toLowerCase(),
      timeLimit: Number(quizInput.timeLimit || 0),
      passingScore: Number(quizInput.passingScore || 0),
      totalMarks: Number(quizInput.totalMarks || 100),
      questions: Number(quizInput.questions || 10),
    }

    const nextQuizzes = [newQuiz, ...quizzes]
    setQuizzes(nextQuizzes)
    saveQuizzes(nextQuizzes)
  }

  const attemptQuiz = ({ quizId, employeeEmail, score }) => {
    const quiz = quizzes.find((item) => item.id === quizId)
    if (!quiz) return { success: false, message: 'Quiz not found.' }

    const numericScore = Number(score)
    if (Number.isNaN(numericScore)) return { success: false, message: 'Score must be a number.' }

    const passed = numericScore >= quiz.passingScore
    const feedback = passed
      ? 'Good job. Keep improving consistency.'
      : 'Needs improvement. Revisit module materials and retry.'

    const newAttempt = {
      id: `a-${Date.now()}`,
      quizId,
      employeeEmail: employeeEmail.toLowerCase(),
      score: numericScore,
      passed,
      feedback,
      date: new Date().toISOString().slice(0, 10),
    }

    const nextAttempts = [newAttempt, ...quizAttempts]
    setQuizAttempts(nextAttempts)
    saveQuizAttempts(nextAttempts)

    return { success: true, attempt: newAttempt }
  }

  const submitWeeklyReview = (reviewInput) => {
    const week = reviewInput.week || new Date().toISOString().slice(0, 10)
    const nextReview = {
      id: `r-${Date.now()}`,
      employeeEmail: reviewInput.employeeEmail.trim().toLowerCase(),
      trainerEmail: reviewInput.trainerEmail.trim().toLowerCase(),
      week,
      rating: Number(reviewInput.rating || 0),
      comments: reviewInput.comments.trim(),
      improvementAreas: reviewInput.improvementAreas.trim(),
      date: new Date().toISOString().slice(0, 10),
    }

    const nextReviews = [nextReview, ...reviews]
    setReviews(nextReviews)
    saveReviews(nextReviews)
  }

  const value = {
    onboardingRecords,
    modules,
    quizzes,
    quizAttempts,
    reviews,
    profiles,
    upsertOnboardingRecord,
    toggleChecklistItem,
    updateEmployeeProfile,
    createTrainingModule,
    markModuleCompleted,
    submitAssignment,
    createQuiz,
    attemptQuiz,
    submitWeeklyReview,
  }

  return React.createElement(TrainingContext.Provider, { value }, children)
}

export const useTraining = () => {
  const context = useContext(TrainingContext)
  if (!context) {
    throw new Error('useTraining must be used within TrainingProvider')
  }
  return context
}


