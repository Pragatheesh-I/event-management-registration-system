"use client"
import { useEffect, useState } from "react"

export default function Profile() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(setUser)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex bg-[#f0f6ff] font-sans">
        {/* Left Panel */}
        <div className="hidden md:flex w-[45%] flex-col justify-between px-14 py-[52px] relative overflow-hidden bg-gradient-to-br from-[#0a3cff] via-[#1a6fff] to-[#0055cc]">
          <div className="absolute -top-[120px] -right-[120px] w-[400px] h-[400px] rounded-full bg-white/[0.06] pointer-events-none" />
          <div className="absolute -bottom-[80px] -left-[80px] w-[320px] h-[320px] rounded-full bg-white/[0.05] pointer-events-none" />
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-white/20 backdrop-blur-md shrink-0">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">EventFlow</span>
          </div>
          <div className="z-10">
            <h1 className="text-[2.8rem] font-extrabold text-white leading-[1.15] tracking-tight mb-[18px]">
              Your profile<br /><span className="text-[#a8cfff]">awaits</span>
            </h1>
            <p className="text-base text-white/75 leading-relaxed max-w-[320px] font-light">
              Sign in to view and manage your EventFlow profile, events, and registrations.
            </p>
          </div>
        </div>

        {/* Right Panel — not logged in */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 md:px-10 bg-[#f0f6ff]">
          <div className="w-full max-w-[420px] text-center">
            <div className="w-20 h-20 rounded-full bg-[#dae4f5] flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#90a8c8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="text-[2rem] font-bold text-[#0a1a3a] tracking-tight mb-2">View your profile</h2>
            <p className="text-[0.95rem] text-[#6b82a8] mb-8">You need to be signed in to access your profile.</p>
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-[15px] bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] text-white rounded-xl text-base font-semibold tracking-wide shadow-[0_4px_20px_rgba(10,60,255,0.3)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(10,60,255,0.4)]"
            >
              Login to View Profile
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#f0f6ff] font-sans">

      {/* ── Left Panel ── */}
      <div className="hidden md:flex w-[45%] flex-col justify-between px-14 py-[52px] relative overflow-hidden bg-gradient-to-br from-[#0a3cff] via-[#1a6fff] to-[#0055cc]">
        <div className="absolute -top-[120px] -right-[120px] w-[400px] h-[400px] rounded-full bg-white/[0.06] pointer-events-none" />
        <div className="absolute -bottom-[80px] -left-[80px] w-[320px] h-[320px] rounded-full bg-white/[0.05] pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-white/20 backdrop-blur-md shrink-0">
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">EventFlow</span>
        </div>

        {/* Hero copy */}
        <div className="z-10">
          <h1 className="text-[2.8rem] font-extrabold text-white leading-[1.15] tracking-tight mb-[18px]">
            Hello,<br /><span className="text-[#a8cfff]">{user.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-[320px] font-light">
            Manage your account details, track your events, and stay on top of your registrations.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 md:px-10 bg-[#f0f6ff]">
        <div className="w-full max-w-[420px]">

          {/* Avatar + heading */}
          <div className="mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] flex items-center justify-center mb-4 shadow-[0_4px_20px_rgba(10,60,255,0.3)]">
              <span className="text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-[2rem] font-bold text-[#0a1a3a] tracking-tight mb-1">Your Profile</h2>
            <p className="text-[0.95rem] text-[#6b82a8]">Manage your account information</p>
          </div>

          {/* Profile rows */}
          <div className="space-y-[14px] mb-8">
            <ProfileRow label="Full Name" value={user.name} icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            } />
            <ProfileRow label="Email" value={user.email} icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            } />
            <ProfileRow label="Role" value={user.role} highlight icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            } />
          </div>

          {/* Edit button */}
          <button className="w-full flex items-center justify-center gap-2 py-[15px] bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] text-white rounded-xl text-base font-semibold tracking-wide shadow-[0_4px_20px_rgba(10,60,255,0.3)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(10,60,255,0.4)] active:translate-y-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7 text-[0.82rem] text-[#b0c4de]">
            <div className="flex-1 h-px bg-[#dae4f5]" />
            account
            <div className="flex-1 h-px bg-[#dae4f5]" />
          </div>

          {/* Sign out */}
          <button className="w-full flex items-center justify-center gap-2 py-[13px] bg-white border-[1.5px] border-[#dae4f5] text-[#6b82a8] rounded-xl text-[0.95rem] font-medium transition-all duration-150 hover:border-red-300 hover:text-red-500 hover:bg-red-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>

        </div>
      </div>
    </div>
  )
}

function ProfileRow({ label, value, highlight = false, icon }: {
  label: string
  value: string
  highlight?: boolean
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-4 py-[14px] bg-white border-[1.5px] border-[#dae4f5] rounded-xl transition duration-200 hover:border-[#0a3cff]/30 hover:shadow-sm">
      <div className="flex items-center gap-2.5 text-[#90a8c8]">
        {icon}
        <span className="text-[0.82rem] font-medium text-[#3a4f6e] uppercase tracking-[0.04em]">{label}</span>
      </div>
      <span className={`text-[0.95rem] font-semibold ${highlight ? "text-[#0a3cff]" : "text-[#0a1a3a]"}`}>
        {value}
      </span>
    </div>
  )
}