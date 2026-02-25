// Purpose: Implements logic/UI for AdminCreateMemberPage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { hasEmailDomain, isValidEmail } from '../../utils/validation'

const memberDefaults = {
  name: '',
  email: '',
  designation: '',
  password: '',
  confirmPassword: '',
}

const AdminCreateMemberPage = () => {
  // Auth actions and current logged-in user.
  const { user, createMember, listMembers, removeMember } = useAuth()
  const { notifySuccess, notifyError } = useToast()

  // Form state, members list state, and form visibility toggle.
  const [memberForm, setMemberForm] = useState(memberDefaults)
  const [members, setMembers] = useState([])
  const [showForm, setShowForm] = useState(false)

  // Ref used to focus the first input when form opens.
  const nameInputRef = useRef(null)

  // Reads all members from storage/context and syncs local table state.
  const refreshMembers = () => {
    const allMembers = typeof listMembers === 'function' ? listMembers() : []
    setMembers(Array.isArray(allMembers) ? allMembers : [])
  }

  // Initial load: fetch members once when page mounts.
  useEffect(() => {
    refreshMembers()
  }, [])

  // When form opens, focus the Name input for better UX.
  useEffect(() => {
    if (showForm) {
      window.setTimeout(() => nameInputRef.current?.focus(), 0)
    }
  }, [showForm])

  // Memoized list used by the table.
  const visibleMembers = useMemo(() => members, [members])

  // Generic handler for all form inputs.
  const onMemberInput = (field, value) => {
    setMemberForm((prev) => ({ ...prev, [field]: value }))
  }

  // Validates member creation form and returns an error message if invalid.
  const validateMemberForm = () => {
    const { name, email, designation, password, confirmPassword } = memberForm

    if (name.trim().length < 2) return 'Name must be at least 2 characters.'
    if (!isValidEmail(email)) return 'Enter a valid email.'

    const normalizedEmail = email.trim().toLowerCase()
    const validDomain =
      hasEmailDomain(normalizedEmail, '@employee.com') ||
      hasEmailDomain(normalizedEmail, '@trainer.com') ||
      hasEmailDomain(normalizedEmail, '@admin.com')

    if (!validDomain) return 'Email must end with @employee.com, @trainer.com, or @admin.com.'
    if (designation.trim().length < 2) return 'Designation must be at least 2 characters.'
    if (password.length < 5) return 'Password must be at least 5 characters.'
    if (password !== confirmPassword) return 'Password and confirm password do not match.'
    return ''
  }

  // Submits create-member form, shows feedback, and refreshes table.
  const handleCreateMember = (e) => {
    e.preventDefault()
    const validationError = validateMemberForm()
    if (validationError) {
      notifyError(validationError)
      return
    }

    const result = createMember({
      name: memberForm.name,
      email: memberForm.email,
      designation: memberForm.designation,
      password: memberForm.password,
    })

    if (!result.success) {
      notifyError(result.message)
      return
    }

    setMemberForm(memberDefaults)
    setShowForm(false)
    refreshMembers()
    notifySuccess('Member created successfully.')
  }

  // Removes a member after confirmation and refreshes table.
  const handleRemoveMember = (member) => {
    if (!member?.id) return

    const confirmed = window.confirm(`Remove ${member.name} (${member.email})?`)
    if (!confirmed) return

    const result = removeMember(member.id)

    if (!result.success) {
      notifyError(result.message)
      return
    }

    refreshMembers()
    notifySuccess('Member removed successfully.')
  }

  return (
    <section className="ml-64 min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-white">
        <article className="border border-slate-700 bg-slate-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Create Members</h1>
              <p className="mt-1 text-sm text-slate-300">Use the button to add employee details.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="border border-slate-500 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              + Add Employee
            </button>
          </div>
        </article>

        <article className="border border-slate-700 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Members List</h2>
          <p className="mt-1 text-sm text-slate-300">Created members are stored in local storage.</p>
          {/* Members data table. */}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border border-slate-700 text-left text-sm">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="border border-slate-700 px-4 py-2 font-medium">Name</th>
                  <th className="border border-slate-700 px-4 py-2 font-medium">Email</th>
                  <th className="border border-slate-700 px-4 py-2 font-medium">Role</th>
                  <th className="border border-slate-700 px-4 py-2 font-medium">Designation</th>
                  <th className="border border-slate-700 px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900">
                {visibleMembers.length === 0 ? (
                  <tr>
                    <td className="border border-slate-700 px-4 py-4 text-slate-300" colSpan={5}>
                      No members found.
                    </td>
                  </tr>
                ) : (
                  visibleMembers.map((member) => {
                    // Prevent deleting admin account and current logged-in account.
                    const protectedAccount = member.role === 'admin' || member.id === user?.id

                    return (
                      <tr key={member.id}>
                        <td className="border border-slate-700 px-4 py-2 font-medium">{member.name}</td>
                        <td className="border border-slate-700 px-4 py-2 text-slate-300">{member.email}</td>
                        <td className="border border-slate-700 px-4 py-2 capitalize">{member.role}</td>
                        <td className="border border-slate-700 px-4 py-2 text-slate-300">{member.designation}</td>
                        <td className="border border-slate-700 px-4 py-2">
                          <button
                            type="button"
                            disabled={protectedAccount}
                            onClick={() => handleRemoveMember(member)}
                            className={
                              protectedAccount
                                ? 'border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-500'
                                : 'border border-red-500 bg-transparent px-3 py-1 text-xs text-red-300 hover:bg-red-900/20'
                            }
                            title={
                              member.role === 'admin'
                                ? 'Admin accounts cannot be removed.'
                                : member.id === user?.id
                                  ? 'You cannot remove your own account.'
                                  : 'Remove member'
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      {/* Popup create-member form fixed near top of viewport. */}
      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24">
          <article className="w-full max-w-2xl border border-slate-700 bg-slate-900 p-6 text-white">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Add New Employee/Member</h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setMemberForm(memberDefaults)
                }}
                className="border border-slate-500 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleCreateMember}>
              <input
                ref={nameInputRef}
                value={memberForm.name}
                onChange={(e) => onMemberInput('name', e.target.value)}
                placeholder="Name"
                className="w-full border border-slate-600 bg-slate-950 px-4 py-2 text-white outline-none"
              />
              <input
                value={memberForm.email}
                onChange={(e) => onMemberInput('email', e.target.value)}
                placeholder="name@employee.com / @trainer.com / @admin.com"
                className="w-full border border-slate-600 bg-slate-950 px-4 py-2 text-white outline-none"
              />
              <input
                value={memberForm.designation}
                onChange={(e) => onMemberInput('designation', e.target.value)}
                placeholder="Designation"
                className="w-full border border-slate-600 bg-slate-950 px-4 py-2 text-white outline-none"
              />
              <input
                type="password"
                value={memberForm.password}
                onChange={(e) => onMemberInput('password', e.target.value)}
                placeholder="Password"
                className="w-full border border-slate-600 bg-slate-950 px-4 py-2 text-white outline-none"
              />
              <input
                type="password"
                value={memberForm.confirmPassword}
                onChange={(e) => onMemberInput('confirmPassword', e.target.value)}
                placeholder="Confirm Password"
                className="w-full border border-slate-600 bg-slate-950 px-4 py-2 text-white outline-none"
              />
              <button
                type="submit"
                className="w-full border border-slate-500 bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700"
              >
                Create Member
              </button>
            </form>
          </article>
        </div>
      ) : null}
    </section>
  )
}

export default AdminCreateMemberPage

