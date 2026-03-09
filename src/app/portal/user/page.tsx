// this is Registered Events Page for User
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
    <div className="min-h-[80vh]">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          My Registered Events
        </h1>
        <p className="text-slate-400 mt-2">
          Track the events you have joined and their current status
        </p>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-slate-300">
            You haven’t registered for any events yet
          </h2>
          <p className="text-slate-500 mt-3">
            Browse events and register to see them here.
          </p>
        </div>
      )}

      {/* Events Grid */}
      {events.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(item => (
            <div
              key={item.id}
              className="group relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-indigo-500/20 transition-all duration-300"
            >
              {/* Event Title */}
              <h3 className="text-xl font-bold text-indigo-400 group-hover:text-indigo-300 transition">
                {item.event.title}
              </h3>

              {/* Event Status */}
              <p className="mt-3 text-slate-400">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    item.status === "Present"
                      ? "text-green-400"
                      : item.status === "Absent"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>
              </p>

              {/* Event Date / Location */}
              {item.event.date && (
                <p className="mt-1 text-slate-500 text-sm">
                  📅 {new Date(item.event.date).toLocaleDateString()}
                </p>
              )}
              {item.event.location && (
                <p className="mt-1 text-slate-500 text-sm">
                  📍 {item.event.location}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}