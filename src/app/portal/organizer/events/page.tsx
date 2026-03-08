// Show All Created Events by Organizer 
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function MyEvents() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/organizer/CreatedEvents")
      .then(res => res.json())
      .then(setEvents)
  }, [])

  return (
    <div className="min-h-[80vh]">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          My Created Events
        </h1>
        <p className="text-slate-400 mt-2">
          Manage and track your events here.
        </p>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-slate-300">
            No Events Created Yet
          </h2>
          <p className="text-slate-500 mt-3">
            Create your first event to see it listed here.
          </p>

          <a
            href="/create-event"
            className="inline-block mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-xl font-medium hover:scale-105 transition duration-300 shadow-md"
          >
            Create Event →
          </a>
        </div>
      )}

      {/* Events Grid */}
      {events.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <div
              key={event.id}
              className="group relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-indigo-500/20 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-indigo-400 group-hover:text-indigo-300 transition">
                {event.title}
              </h3>

              <div className="mt-4 text-slate-400 text-sm space-y-2 opacity-80 group-hover:opacity-100 transition">
                <p>{event.description}</p>
                <p>📍 {event.location}</p>
              </div>

              <Link
                href={`/portal/organizer/events/${event.id}`}
                className="inline-block mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 rounded-xl font-medium hover:scale-105 transition duration-300 shadow-md"
              >
                View Event →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}