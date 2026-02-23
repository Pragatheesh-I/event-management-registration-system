"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push("/dashboard/user")
    } else {
      setError("Invalid email or password. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f0f6ff] font-sans">

      {/* ── Left Panel ── */}
      <div className="hidden md:flex w-[45%] flex-col justify-between px-14 py-[52px] relative overflow-hidden bg-gradient-to-br from-[#0a3cff] via-[#1a6fff] to-[#0055cc]">

        {/* Decorative blurred circles */}
        <div className="absolute -top-[120px] -right-[120px] w-[400px] h-[400px] rounded-full bg-white/[0.06] pointer-events-none" />
        <div className="absolute -bottom-[80px] -left-[80px] w-[320px] h-[320px] rounded-full bg-white/[0.05] pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-white/20 backdrop-blur-md shrink-0">
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">EventFlow</span>
        </div>

        {/* Hero copy */}
        <div className="z-10">
          <h1 className="text-[2.8rem] font-extrabold text-white leading-[1.15] tracking-tight mb-[18px]">
            Manage events<br />with <span className="text-[#a8cfff]">clarity</span>
          </h1>
          <p className="text-base text-white/75 leading-relaxed max-w-[320px] font-light">
            Track registrations, manage attendance, and run your events seamlessly — all in one place.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 md:px-10 bg-[#f0f6ff]">
        <div className="w-full max-w-[420px]">

          {/* Form header */}
          <div className="mb-10">
            <h2 className="text-[2rem] font-bold text-[#0a1a3a] tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-[0.95rem] text-[#6b82a8]">
              Don't have an account?{" "}
              <a href="/register" className="text-[#0a3cff] font-medium hover:underline">
                Sign up free
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Error alert */}
            {error && (
              <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-[10px] bg-[#fff0f0] border border-[#ffc0c0] text-[0.875rem] text-[#cc2200]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="mb-[22px]">
              <label className="block text-[0.82rem] font-medium text-[#3a4f6e] uppercase tracking-[0.04em] mb-2">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#90a8c8] pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-[46px] pr-4 py-[14px] bg-white border-[1.5px] border-[#dae4f5] rounded-xl text-[0.95rem] text-[#0a1a3a] placeholder-[#b0c4de] outline-none transition duration-200 focus:border-[#0a3cff] focus:ring-4 focus:ring-[#0a3cff]/[0.08]"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="mb-[22px]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[0.82rem] font-medium text-[#3a4f6e] uppercase tracking-[0.04em]">
                  Password
                </label>
                <a href="/forgot-password" className="text-[0.82rem] text-[#0a3cff] font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#90a8c8] pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full pl-[46px] pr-4 py-[14px] bg-white border-[1.5px] border-[#dae4f5] rounded-xl text-[0.95rem] text-[#0a1a3a] placeholder-[#b0c4de] outline-none transition duration-200 focus:border-[#0a3cff] focus:ring-4 focus:ring-[#0a3cff]/[0.08]"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-[15px] bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] text-white rounded-xl text-base font-semibold tracking-wide shadow-[0_4px_20px_rgba(10,60,255,0.3)] transition-all duration-150 hover:enabled:-translate-y-px hover:enabled:shadow-[0_6px_28px_rgba(10,60,255,0.4)] active:enabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7 text-[0.82rem] text-[#b0c4de]">
            <div className="flex-1 h-px bg-[#dae4f5]" />
            or
            <div className="flex-1 h-px bg-[#dae4f5]" />
          </div>

          {/* Register prompt */}
          <p className="text-center text-[0.88rem] text-[#6b82a8]">
            New to EventFlow?{" "}
            <a href="/register" className="text-[#0a3cff] font-semibold hover:underline">
              Create an account →
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}