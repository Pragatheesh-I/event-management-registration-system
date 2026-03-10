"use client"
 
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {z} from "zod"
import { loginSchema } from "@/lib/zod/loginSchema"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = loginSchema.safeParse(form)
    if (!result.success){
        const error = result.error.issues[0]
        toast.error(error.message)
        setLoading(false)
    }else{
   
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      })
 
      if (res.ok) {
        toast.success("Login successful")
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 2000)
      } else {
        toast.error("Invalid email or password")
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      toast.error("Something went wrong")
    }
 
    setLoading(false)
  }
  }
 
  return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-[#dae4f5] rounded-2xl p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0a1a3a]">Welcome to EventFlow</h1>
          <p className="mt-2 text-sm text-[#6b82a8]">
            Sign in to continue to EventFlow
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
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-xl border border-[#dae4f5] bg-white px-4 py-3 text-sm text-[#0a1a3a] outline-none focus:border-[#0a3cff] focus:ring-2 focus:ring-[#0a3cff]/10"
            />
          </div>
 
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[#3a4f6e]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full rounded-xl border border-[#dae4f5] bg-white px-4 py-3 text-sm text-[#0a1a3a] outline-none focus:border-[#0a3cff] focus:ring-2 focus:ring-[#0a3cff]/10"
            />
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0a3cff] px-4 py-3 text-white font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
 
        <p className="mt-6 text-center text-sm text-[#6b82a8]">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-semibold text-[#0a3cff] hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}