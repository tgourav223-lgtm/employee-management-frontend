// Purpose: Implements logic/UI for validation.js
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const hasEmailDomain = (email, domain) =>
  email.trim().toLowerCase().endsWith(domain.toLowerCase())

export const isHttpUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const isValidPhone = (value) => /^\d{10}$/.test(value.trim())

export const isWeekKey = (value) => /^\d{4}-W\d{2}$/.test(value.trim())

export const todayISO = () => new Date().toISOString().slice(0, 10)


