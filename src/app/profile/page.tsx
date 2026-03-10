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
      <div className="min-h-screen flex items-center justify-center bg-[#f0f6ff] font-sans">
        <div className="w-full max-w-[420px] text-center px-6 py-12">
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
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f6ff] font-sans">
      <div className="w-full max-w-[420px] px-6 py-12">
        {/* Avatar + heading */}
        <div className="mb-10 text-center">
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

        {/* Divider + sign out */}
        <div className="flex items-center gap-3 my-7 text-[0.82rem] text-[#b0c4de]">
          <div className="flex-1 h-px bg-[#dae4f5]" />
          account
          <div className="flex-1 h-px bg-[#dae4f5]" />
        </div>
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