// Purpose: Implements logic/UI for EmployeeProfilePage.jsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTraining } from '../../contexts/TrainingContext'
import { useToast } from '../../contexts/ToastContext'
import { isValidPhone } from '../../utils/validation'

const EmployeeProfilePage = () => {
  const { user } = useAuth()
  const { profiles, updateEmployeeProfile } = useTraining()
  const { notifySuccess, notifyError } = useToast()

  const employeeEmail = user?.email || ''
  const existingProfile = profiles.find((profile) => profile.email === employeeEmail)
  const [profileForm, setProfileForm] = useState({
    phone: existingProfile?.phone || '',
    location: existingProfile?.location || '',
    bio: existingProfile?.bio || '',
  })

  const handleProfileSubmit = (e) => {
    e.preventDefault()

    if (profileForm.phone && !isValidPhone(profileForm.phone)) {
      notifyError('Phone must be exactly 10 digits.')
      return
    }

    if (profileForm.bio.trim().length > 220) {
      notifyError('Bio must be 220 characters or less.')
      return
    }

    updateEmployeeProfile(employeeEmail, profileForm)
    notifySuccess('Profile updated successfully.')
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-semibold">Update Profile</h1>
        <form className="mt-5 space-y-3" onSubmit={handleProfileSubmit}>
          <input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <input value={profileForm.location} onChange={(e) => setProfileForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <textarea value={profileForm.bio} onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Bio" rows="4" className="w-full rounded-xl border border-cyan-500 bg-slate-950 px-3 py-2 text-white" />
          <button className="w-full rounded-full bg-cyan-500 py-2 font-semibold text-slate-900">Save Profile</button>
        </form>
      </div>
    </section>
  )
}

export default EmployeeProfilePage


