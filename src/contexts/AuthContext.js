// Purpose: Implements logic/UI for AuthContext.js
import React, { createContext, useContext, useState } from 'react'
import {
  clearSession,
  getSession,
  getUsers,
  initializeAppStorage,
  saveSession,
  saveUsers,
} from '../utils/localstorage'

const AuthContext = createContext(null)

const getRoleFromEmail = (email) => {
  if (email.includes('@employee.com')) return 'employee'
  if (email.includes('@trainer.com')) return 'trainer'
  if (email.includes('@admin.com')) return 'admin'
  return null
}

const getNameFromEmail = (email) => {
  const localPart = email.split('@')[0] || 'user'
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
}

const defaultDesignation = (role) => {
  if (role === 'admin') return 'Administrator'
  if (role === 'trainer') return 'Trainer'
  return 'Employee'
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    initializeAppStorage()
    return getSession()
  })

  const listMembers = () => getUsers()

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const role = getRoleFromEmail(normalizedEmail)

    if (!role) {
      return { success: false, message: 'Use @employee.com, @trainer.com, or @admin.com email.' }
    }

    const users = getUsers()
    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail)

    if (existingUser && existingUser.password !== password) {
      return { success: false, message: 'Invalid credentials.' }
    }

    if (!existingUser && password !== '12345') {
      return { success: false, message: 'Mock password is 12345.' }
    }

    const authenticatedUser = existingUser || {
      id: `u-${Date.now()}`,
      name: getNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      password,
      role,
      designation: defaultDesignation(role),
    }

    if (!existingUser) {
      saveUsers([...users, authenticatedUser])
    }

    const sessionUser = {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      designation: authenticatedUser.designation,
    }

    saveSession(sessionUser)
    setUser(sessionUser)

    return { success: true, user: sessionUser }
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  const createMember = (member) => {
    const users = getUsers()
    const normalizedEmail = member.email.trim().toLowerCase()

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'Member with this email already exists.' }
    }

    const role = getRoleFromEmail(normalizedEmail)

    if (!role) {
      return { success: false, message: 'Email must use @employee.com, @trainer.com, or @admin.com.' }
    }

    const nextUser = {
      id: `u-${Date.now()}`,
      name: member.name.trim(),
      email: normalizedEmail,
      password: member.password,
      role,
      designation: member.designation.trim() || defaultDesignation(role),
    }

    saveUsers([...users, nextUser])
    return { success: true, user: nextUser }
  }

  const removeMember = (memberId) => {
    const users = getUsers()
    const target = users.find((entry) => entry.id === memberId)

    if (!target) {
      return { success: false, message: 'Member not found.' }
    }

    if (user?.id === memberId) {
      return { success: false, message: 'You cannot remove your own account.' }
    }

    if (target.role === 'admin') {
      return { success: false, message: 'Admin accounts cannot be removed.' }
    }

    saveUsers(users.filter((entry) => entry.id !== memberId))
    return { success: true }
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    listMembers,
    login,
    logout,
    createMember,
    removeMember,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

