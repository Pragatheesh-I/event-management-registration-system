"use client"
 interface User {
  id: string
  name?:  string | undefined
  email?: string |undefined
  role: "USER" | "ORGANIZER"
}
import { useEffect, useState } from "react"
 
export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
 
  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(setUser)
  }, [])

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }
 
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-[#dae4f5] rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#eef4ff] flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#90a8c8"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
 
          <h1 className="text-3xl font-bold text-[#0a1a3a]">View Profile</h1>
          <p className="mt-2 text-sm text-[#6b82a8]">
            You need to be signed in to access your profile.
          </p>
 
          <a
            href="/login"
            className="mt-6 inline-block w-full rounded-xl bg-[#0a3cff] px-4 py-3 text-white font-semibold transition hover:bg-blue-700"
          >
            Login to View Profile
          </a>
        </div>
      </div>
    )
  }
 
  return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-[#dae4f5] rounded-2xl p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0a3cff] text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
 
          <h1 className="text-3xl font-bold text-[#0a1a3a]">Your Profile</h1>
          <p className="mt-2 text-sm text-[#6b82a8]">
            Manage your account information
          </p>
        </div>
 
        <div className="space-y-4">
          <ProfileRow label="Full Name" value={ user.name || ""} />
          <ProfileRow label="Email" value={user.email || ""} />
          <ProfileRow label="Role" value={user.role} highlight />
        </div>
 
        <div className="my-6 border-t border-[#dae4f5]" />
 
        <button onClick={signOut} className="w-full rounded-xl border border-[#dae4f5] bg-white px-4 py-3 text-[#6b82a8] font-medium transition hover:border-red-300 hover:bg-red-50 hover:text-red-500">
          Sign out
        </button>
      </div>
    </div>
  )
}
 
function ProfileRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl border border-[#dae4f5] bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6b82a8]">
        {label}
      </p>
      <p className={`mt-1 font-semibold ${highlight ? "text-[#0a3cff]" : "text-[#0a1a3a]"}`}>
        {value}
      </p>
    </div>
  )
}
 