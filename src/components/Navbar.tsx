"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  async function fetchUser() {
    try {
      const res = await fetch("/api/me", { cache: "no-store", credentials: "include" })
      if (!res.ok) { setUser(null); return }
      setUser(await res.json())
    } catch {
      setUser(null)
    }
  }

  useEffect(() => { fetchUser() }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setDropdownOpen(false)
    window.location.reload()
  }

  const navLink = "text-[0.88rem] font-medium text-[#3a4f6e] hover:text-[#0a3cff] transition-colors duration-150"

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#dae4f5] shadow-sm">
      <div className="w-full flex justify-between items-center px-6 py-3.5">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] shadow-[0_2px_8px_rgba(10,60,255,0.3)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-[1.1rem] font-bold text-[#0a1a3a] tracking-wide group-hover:text-[#0a3cff] transition-colors duration-150">
            EventFlow
          </span>
        </Link>

        {/* Nav links + actions */}
        <div className="flex items-center gap-5">

          <Link href="/events" className={navLink}>Events</Link>

          {user?.role === "ORGANIZER" && (
            <>
              <Link href="/portal/organizer/create" className={navLink}>Create</Link>
              <Link href="/portal/organizer/dashboard" className={navLink}>Dashboard</Link>
              <Link href="/portal/organizer/events" className={navLink}>My Events</Link>
            </>
          )}

          {user?.role === "USER" && (
            <Link href="/portal/user" className={navLink}>Registered</Link>
          )}

          {user ? (
            /* ── Profile Dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border-[1.5px] border-[#dae4f5] bg-white hover:border-[#0a3cff]/40 hover:shadow-sm transition-all duration-150"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] flex items-center justify-center shadow-[0_2px_6px_rgba(10,60,255,0.25)] shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Name + role */}
                <div className="text-left hidden sm:block">
                  <div className="text-[0.82rem] font-semibold text-[#0a1a3a] leading-tight">{user.name}</div>
                  <div className="text-[0.7rem] text-[#90a8c8] leading-tight">{user.role}</div>
                </div>
                {/* Chevron */}
                <svg
                  className={`w-3.5 h-3.5 text-[#90a8c8] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#dae4f5] rounded-2xl shadow-[0_8px_32px_rgba(10,60,255,0.10)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">

                  {/* User info header */}
                  <div className="px-4 py-3.5 border-b border-[#dae4f5] bg-[#f0f6ff]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] flex items-center justify-center shadow-[0_2px_8px_rgba(10,60,255,0.25)] shrink-0">
                        <span className="text-white text-sm font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-[0.88rem] font-semibold text-[#0a1a3a] leading-tight">{user.name}</div>
                        <div className="text-[0.75rem] text-[#6b82a8] leading-tight truncate max-w-[140px]">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <DropdownLink href="/profile" icon={
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    } onClick={() => setDropdownOpen(false)}>
                      Profile
                    </DropdownLink>

                    {user.role === "USER" && (
                      <DropdownLink href="/portal/user" icon={
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      } onClick={() => setDropdownOpen(false)}>
                        My Registrations
                      </DropdownLink>
                    )}

                    {user.role === "ORGANIZER" && (
                      <>
                        <DropdownLink href="/portal/organizer/dashboard" icon={
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                          </svg>
                        } onClick={() => setDropdownOpen(false)}>
                          Dashboard
                        </DropdownLink>
                        <DropdownLink href="/portal/organizer/events" icon={
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        } onClick={() => setDropdownOpen(false)}>
                          My Events
                        </DropdownLink>
                      </>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[#dae4f5] py-1.5">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.88rem] font-medium text-[#6b82a8] hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Auth buttons ── */
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl border-[1.5px] border-[#dae4f5] text-[0.88rem] font-medium text-[#3a4f6e] bg-white hover:border-[#0a3cff]/40 hover:text-[#0a3cff] transition-all duration-150"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl text-[0.88rem] font-semibold text-white bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] shadow-[0_2px_12px_rgba(10,60,255,0.25)] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(10,60,255,0.35)] transition-all duration-150"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function DropdownLink({ href, icon, children, onClick }: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-[0.88rem] font-medium text-[#3a4f6e] hover:bg-[#f0f6ff] hover:text-[#0a3cff] transition-colors duration-150"
    >
      <span className="text-[#90a8c8]">{icon}</span>
      {children}
    </Link>
  )
}