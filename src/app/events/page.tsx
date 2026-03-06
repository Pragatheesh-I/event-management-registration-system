// This is the Events Page for Public View of All Events -> Aswath
"use client"
 interface Event {
  id: string
  title: string
  location: string
}
import { useEffect, useState } from "react"
import EventCard from "@/components/EventCard"
export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [code, setCode] = useState("")
 
  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(setEvents)
  }, [])
 
  async function searchPrivate() {
    const res = await fetch("/api/events/search", {
      method: "POST",
      body: JSON.stringify({ code })
    })
    const data = await res.json()
    if (data) setEvents([data])
  }
 
  return (
    <div className="min-h-[80vh]">
 
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Explore Events
        </h1>
        <p className="text-slate-400 mt-2">
          Browse public events or search using a private code.
        </p>
      </div>
 
      {/* Private Code Search */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 shadow-lg">
 
        <input
          placeholder="Enter private event code..."
          className="flex-1 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onChange={e => setCode(e.target.value)}
        />
 
        <button
          onClick={searchPrivate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-xl font-medium hover:scale-105 transition duration-300 shadow-md"
        >
          Search →
        </button>
      </div>
 
      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center text-slate-500 mt-20">
          No events found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
} 