"use client"
 
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
 
interface User {
  id: string
  role: "USER" | "ORGANIZER"
  name?: string
}
 
interface Attendee {
  id: string
  userId: string
  status: "PRESENT" | "ABSENT" | "NOT_MARKED"
}
 
interface EventData {
  id: string
  title: string
  description?: string
  location?: string
  eventDate?: string
  isPrivate?: boolean
  attendees?: Attendee[]
}
 
export default function EventDetail() {
  const params = useParams()
  const id = params?.id as string
 
  const [event, setEvent] = useState<EventData | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState("")
 
  async function loadPage() {
    try {
      setLoading(true)
      setError("")
 
      const [eventRes, meRes] = await Promise.all([
        fetch(`/api/events/${id}`, { cache: "no-store" }),
        fetch("/api/me", { cache: "no-store" }),
      ])
 
      if (!eventRes.ok) {
        throw new Error("Failed to load event details")
      }
 
      const eventData = await eventRes.json()
      setEvent(eventData)
 
      if (meRes.ok) {
        const meData = await meRes.json()
        setUser(meData)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error(err)
      setError("Unable to load event details.")
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    if (id) loadPage()
  }, [id])
 
  const alreadyRegistered = useMemo(() => {
    if (!user || !event?.attendees) return false
    return event.attendees.some((a) => a.userId === user.id)
  }, [user, event])
 
  async function register() {
    if (!user) {
       toast.error("Please login first")
       setTimeout(() => {
        window.location.href = "/login"
      }, 1200)
      return
    }
 
    if (user.role !== "USER") return
    if (alreadyRegistered) return
 
    try {
      setRegistering(true)
 
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
 
      const data = await res.json()
 
      if (res.status === 401) {
         toast.error("Please login first")
        setTimeout(() => {
          window.location.href = "/login"
        }, 1200)
      }
 
      if (res.status === 403) {
        toast.error("Only users can register for events")
        return
      }
 
      if (!res.ok) {
        toast.error(data.error || "Registration failed")
        return
      }
 
      toast.success("Successfully registered!")
      loadPage()
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
    } finally {
      setRegistering(false)
    }
  }
 
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-6">
        <div className="w-full max-w-3xl bg-white border border-[#dae4f5] rounded-2xl p-10 shadow-sm">
          <p className="text-[#6b82a8]">Loading event details...</p>
        </div>
      </div>
    )
  }
 
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-6">
        <div className="w-full max-w-3xl bg-white border border-[#dae4f5] rounded-2xl p-10 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0a1a3a]">Event Details</h1>
          <p className="mt-4 text-red-500">{error || "Event not found."}</p>
        </div>
      </div>
    )
  }
 
  return (
    <div className="min-h-screen bg-[#f0f6ff] px-6 py-14">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#dae4f5] rounded-[28px] p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0a1a3a]">
                {event.title}
              </h1>
 
              <p className="mt-3 text-[#6b82a8]">
                View complete event information and registration details.
              </p>
            </div>
 
            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                event.isPrivate
                  ? "border border-[#ffd9a8] bg-[#fff4e8] text-[#b96a00]"
                  : "border border-[#bde7cb] bg-[#eefbf3] text-[#1f8a4d]"
              }`}
            >
              {event.isPrivate ? "Private" : "Public"}
            </span>
          </div>
 
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e6eefb] bg-[#f8fbff] px-5 py-4">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#93a8c5]">
                Date
              </p>
              <p className="mt-1 text-[#23406a] font-medium">
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Coming soon"}
              </p>
            </div>
 
            <div className="rounded-2xl border border-[#e6eefb] bg-[#f8fbff] px-5 py-4">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#93a8c5]">
                Location
              </p>
              <p className="mt-1 text-[#23406a] font-medium">
                {event.location || "Location to be announced"}
              </p>
            </div>
          </div>
 
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-[#0a1a3a]">Description</h2>
            <p className="mt-3 text-[#23406a] leading-8">
              {event.description || "No description available for this event."}
            </p>
          </div>
 
          <div className="mt-8 rounded-2xl border border-[#e6eefb] bg-[#f8fbff] px-5 py-4">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#93a8c5]">
              Registered Count
            </p>
            <p className="mt-1 text-[#23406a] font-medium">
              {event.attendees?.length || 0} attendee(s)
            </p>
          </div>
 
          {user?.role === "USER" && (
            <div className="mt-8">
              <button
                onClick={register}
                disabled={registering || alreadyRegistered}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a3cff] px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {alreadyRegistered
                  ? "Already Registered"
                  : registering
                  ? "Registering..."
                  : "Register for Event →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
 