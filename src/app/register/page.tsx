"use client"
 
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
 
export default function RegisterPage() {
  const router = useRouter()
 
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  })
 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
 
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
 
    const data = await res.json()
 
    if (res.ok) {
      toast.success("Registered Successfully")
      router.push("/login")
    } else {
      toast.error("Invalid Email or Password")
      setError(data.error || "Something went wrong")
      setLoading(false)
    }
  }
 
  return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-[#dae4f5] rounded-2xl p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0a1a3a]">Create Account</h1>
          <p className="mt-2 text-sm text-[#6b82a8]">
            Sign up to start using EventFlow
          </p>
        </div>
 
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="mb-5 rounded-lg border border-[#ffc0c0] bg-[#fff0f0] px-4 py-3 text-sm text-[#cc2200]">
              {error}
            </div>
          )}
 
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[#3a4f6e]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-xl border border-[#dae4f5] bg-white px-4 py-3 text-sm text-[#0a1a3a] outline-none focus:border-[#0a3cff] focus:ring-2 focus:ring-[#0a3cff]/10"
            />
          </div>
 
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[#3a4f6e]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-xl border border-[#dae4f5] bg-white px-4 py-3 text-sm text-[#0a1a3a] outline-none focus:border-[#0a3cff] focus:ring-2 focus:ring-[#0a3cff]/10"
            />
          </div>
 
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[#3a4f6e]">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full rounded-xl border border-[#dae4f5] bg-white px-4 py-3 text-sm text-[#0a1a3a] outline-none focus:border-[#0a3cff] focus:ring-2 focus:ring-[#0a3cff]/10"
            />
          </div>
 
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[#3a4f6e]">
              Register As
            </label>
 
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "USER" })}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  form.role === "USER"
                    ? "border-[#0a3cff] bg-[#eef4ff] text-[#0a3cff]"
                    : "border-[#dae4f5] bg-white text-[#6b82a8]"
                }`}
              >
                User
              </button>
 
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "ORGANIZER" })}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  form.role === "ORGANIZER"
                    ? "border-[#0a3cff] bg-[#eef4ff] text-[#0a3cff]"
                    : "border-[#dae4f5] bg-white text-[#6b82a8]"
                }`}
              >
                Organizer
              </button>
            </div>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0a3cff] px-4 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
 
        <p className="mt-6 text-center text-sm text-[#6b82a8]">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-[#0a3cff] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
 