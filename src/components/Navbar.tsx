"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter,usePathname } from "next/navigation"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Fetch the logged-in user
  async function fetchUser() {
    try {
      const res = await fetch("/api/me", {
        
        cache: "no-store",
        credentials: "include",
      })

      if (!res.ok) {
        setUser(null)
        return
      }
      const data = await res.json()
      
      setUser(data)
      console.log(data)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [pathname])

  // Logout
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
     // refresh page after logout
    
    window.location.reload()

  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-400 tracking-wide hover:text-indigo-300 transition"
        >
          Eventify
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/events" className="hover:text-indigo-400 transition duration-200">
            Events
          </Link>

          {user?.role === "ORGANIZER" && (
            <>
              <Link href="/portal/organizer/create" className="hover:text-indigo-400 transition duration-200">
                Create
              </Link>
              <Link href="/portal/organizer/dashboard" className="hover:text-indigo-400 transition duration-200">
                Dashboard
              </Link>
              <Link href="/portal/organizer/events" className="hover:text-indigo-400 transition duration-200">
                My Events
              </Link>
            </>
          )}

          {user?.role === "USER" && (
            <Link href="/portal/user" className="hover:text-indigo-400 transition duration-200">
              Registered
            </Link>
          )}

          {user ? (
            <>
              <Link href="/profile" className="hover:text-indigo-400 transition duration-200">
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 active:scale-[0.97] transition-all duration-200 px-4 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] transition-all duration-200 px-4 py-2 rounded-lg font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white active:scale-[0.97] transition-all duration-200 px-4 py-2 rounded-lg font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}