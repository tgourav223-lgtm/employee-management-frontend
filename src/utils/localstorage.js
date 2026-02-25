// Purpose: Implements logic/UI for localstorage.js
const STORAGE_KEYS = {
  INIT: 'ems_init_v4',
  USERS: 'ems_users',
  TASKS: 'ems_tasks',
  SESSION: 'ems_session',
  ONBOARDING: 'ems_onboarding',
  MODULES: 'ems_modules',
  QUIZZES: 'ems_quizzes',
  QUIZ_ATTEMPTS: 'ems_quiz_attempts',
  REVIEWS: 'ems_reviews',
  PROFILES: 'ems_profiles',
}

const MOCK_USERS = [
  {
    id: 'u-admin-1',
    name: 'Admin User',
    email: 'gourav@admin.com',
    password: '12345',
    role: 'admin',
    designation: 'Administrator',
  },
  {
    id: 'u-trainer-1',
    name: 'Trainer User',
    email: 'gourav@trainer.com',
    password: '12345',
    role: 'trainer',
    designation: 'Senior Trainer',
  },
  {
    id: 'u-emp-1',
    name: 'Employee User',
    email: 'gourav@employee.com',
    password: '12345',
    role: 'employee',
    designation: 'Product Designer',
  },
]

const MOCK_TASKS = [
  {
    id: 't-1',
    title: 'Prepare Monthly Report',
    description: 'Compile monthly KPIs and share with leadership.',
    date: '2026-02-24',
    priority: 'high',
    status: 'new',
    assignee: 'gourav@employee.com',
    category: 'Reporting',
  },
  {
    id: 't-2',
    title: 'Client Follow-Up Call',
    description: 'Follow up with design client on final revisions.',
    date: '2026-02-25',
    priority: 'medium',
    status: 'accepted',
    assignee: 'gourav@employee.com',
    category: 'Client',
  },
  {
    id: 't-3',
    title: 'Update Team Roster',
    description: 'Refresh roster with current department assignments.',
    date: '2026-02-26',
    priority: 'low',
    status: 'completed',
    assignee: 'gourav@employee.com',
    category: 'HR',
  },
  {
    id: 't-4',
    title: 'Fix Login Bug',
    description: 'Resolve role routing issue in login.',
    date: '2026-02-27',
    priority: 'high',
    status: 'failed',
    assignee: 'gourav@employee.com',
    category: 'Engineering',
  },
]

const MOCK_ONBOARDING = [
  {
    id: 'ob-1',
    employeeEmail: 'gourav@employee.com',
    department: 'Design',
    trainerEmail: 'gourav@trainer.com',
    trainingDurationWeeks: 6,
    joiningDate: '2026-02-15',
    checklist: [
      { key: 'docs', label: 'Document Verification', done: true },
      { key: 'tools', label: 'Tools Setup', done: true },
      { key: 'policy', label: 'Policy Orientation', done: false },
      { key: 'mentor', label: 'Mentor Introduction', done: false },
    ],
  },
]

const MOCK_MODULES = [
  {
    id: 'm-1',
    title: 'Design Fundamentals',
    material: 'https://example.com/design-fundamentals.pdf',
    materialType: 'PDF',
    deadline: '2026-03-01',
    quizId: 'q-1',
    assignee: 'gourav@employee.com',
    trainerEmail: 'gourav@trainer.com',
    completedBy: [],
    submissions: {},
  },
]

const MOCK_QUIZZES = [
  {
    id: 'q-1',
    title: 'UI Basics Quiz',
    assignee: 'gourav@employee.com',
    trainerEmail: 'gourav@trainer.com',
    timeLimit: 20,
    passingScore: 60,
    totalMarks: 100,
    questions: 10,
  },
]

const MOCK_ATTEMPTS = [
  {
    id: 'a-1',
    quizId: 'q-1',
    employeeEmail: 'gourav@employee.com',
    score: 72,
    passed: true,
    feedback: 'Good understanding. Improve typography and spacing decisions.',
    date: '2026-02-21',
  },
]

const MOCK_REVIEWS = [
  {
    id: 'r-1',
    employeeEmail: 'gourav@employee.com',
    trainerEmail: 'gourav@trainer.com',
    week: '2026-W08',
    rating: 3,
    comments: 'Consistent progress with minor delays.',
    improvementAreas: 'Time management and prioritization.',
    date: '2026-02-22',
  },
]

const MOCK_PROFILES = [
  {
    email: 'gourav@employee.com',
    phone: '9999999999',
    location: 'New Delhi',
    bio: 'Entry-level product designer in onboarding phase.',
  },
]

export const initializeAppStorage = () => {
  const alreadyInitialized = localStorage.getItem(STORAGE_KEYS.INIT)

  if (!alreadyInitialized) {
    localStorage.clear()
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS))
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(MOCK_TASKS))
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(MOCK_ONBOARDING))
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(MOCK_MODULES))
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(MOCK_QUIZZES))
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(MOCK_ATTEMPTS))
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(MOCK_REVIEWS))
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(MOCK_PROFILES))
    localStorage.removeItem(STORAGE_KEYS.SESSION)
    localStorage.setItem(STORAGE_KEYS.INIT, 'true')
  }
}

export const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
export const saveUsers = (users) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

export const getTasks = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
export const saveTasks = (tasks) => localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))

export const getSession = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null')
export const saveSession = (session) => localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
export const clearSession = () => localStorage.removeItem(STORAGE_KEYS.SESSION)

export const getOnboarding = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ONBOARDING) || '[]')
export const saveOnboarding = (records) =>
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(records))

export const getModules = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.MODULES) || '[]')
export const saveModules = (modules) => localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules))

export const getQuizzes = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]')
export const saveQuizzes = (quizzes) => localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes))

export const getQuizAttempts = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS) || '[]')
export const saveQuizAttempts = (attempts) =>
  localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts))

export const getReviews = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]')
export const saveReviews = (reviews) => localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))

export const getProfiles = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]')
export const saveProfiles = (profiles) => localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles))

export { STORAGE_KEYS }


