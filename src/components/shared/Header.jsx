// Purpose: Implements logic/UI for Header.jsx
import React from 'react'
import benthonLogo from '../../assets/benthon-logo.svg'

const accentStyles = {
  emerald: {
    border: 'border-emerald-500/40',
    subtitle: 'text-emerald-300',
  },
  rose: {
    border: 'border-rose-500/40',
    subtitle: 'text-rose-300',
  },
}

const Header = ({ title, subtitle, userName, accent = 'emerald' }) => {

  const style = accentStyles[accent] || accentStyles.emerald

  return (
    <header className="bg-slate-950 px-4 py-5 md:px-8">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border bg-slate-900 p-4 pl-14 shadow-lg md:p-6 md:pl-16 ${style.border}`}
      >
        <div>
          <img src={benthonLogo} alt="BENTHON" className="mb-2 h-8 w-auto object-contain md:h-10" />
          <p className={`text-sm font-medium ${style.subtitle}`}>{subtitle}</p>
          <h1 className="text-xl font-semibold text-white md:text-2xl">
            {title} {userName ? `- ${userName}` : ''}
          </h1>
        </div>

        
      </div>
    </header>
  )
}

export default Header

