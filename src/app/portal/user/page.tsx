"use client"
 
import { useEffect, useState } from "react"
 
export default function RegisteredEvents() {
  const [events, setEvents] = useState<any[]>([])
 
  useEffect(() => {
    fetch("/api/registration")
      .then(res => res.json())
      .then(setEvents)
  }, [])
 
  return (
    <div className="min-h-screen bg-[#f0f6ff] px-10 py-14">
 
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#0a1a3a]">
          My Registered <span className="text-[#0a3cff]">Events</span>
        </h1>
 
        <p className="text-[#6b82a8] mt-2">
          Track the events you have joined.
        </p>
      </div>
 
      {/* Empty State */}
      {events.length === 0 && (
        <div className="bg-white border border-[#dae4f5] rounded-2xl p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a]">
            No Registered Events
          </h2>
 
          <p className="text-[#6b82a8] mt-3">
            Browse events and register to see them here.
          </p>
        </div>
      )}
 
      {/* Cards */}
      {events.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {events.map((item) => {
 
            const formattedDate = item.event.eventDate
              ? new Date(item.event.eventDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Coming soon"
 
            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-[26px] border border-[#dbe6f6] bg-white p-5 shadow-[0_10px_28px_rgba(30,64,175,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#bfd4ff] hover:shadow-[0_18px_40px_rgba(10,60,255,0.14)]"
              >
 
                {/* Decorative */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#0a3cff]/[0.07] blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0a3cff] via-[#1a6fff] to-[#79a8ff]" />
 
                <div className="relative z-10">
 
                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] text-white shadow-[0_8px_20px_rgba(10,60,255,0.22)]">
                    📅
                  </div>
 
                  {/* Title */}
                  <h3 className="text-[1.2rem] font-bold text-[#0a1a3a]">
                    {item.event.title}
                  </h3>
 
                  {/* Description */}
                  <p className="mt-2 text-[0.95rem] text-[#6f87aa] line-clamp-3">
                    {item.event.description || "No description available for this event."}
                  </p>
 
                  {/* Location */}
                  {item.event.location && (
                    <p className="mt-4 text-sm text-[#6b82a8]">
                      📍 {item.event.location}
                    </p>
                  )}
 
                  {/* Date */}
                  <p className="mt-1 text-sm text-[#6b82a8]">
                    📅 {formattedDate}
                  </p>
 
                </div>
              </div>
            )
          })}
        </div>
      )}
 
    </div>
  )
}
 