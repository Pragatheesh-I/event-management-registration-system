"use client"
 
import { useEffect, useState } from "react"
import EventCardForCreatedEvents from "@/components/EventCardForCreatedEvents"
import Link from "next/link"
interface Event  {
        id: string,
        title: string,
        description: string,
        type: "PUBLIC" | "PRIVATE",
        isPrivate: boolean,
        privateCode: string,
        createdBy: string,
        location: string,
        eventDate: string,
        createdAt: string,
        updatedAt: string,
        organizerId: string
  }
export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([])
 
  useEffect(() => {
    fetch("/api/organizer/CreatedEvents")
      .then(res => res.json())
      .then((data=>{
        console.log(data)
        setEvents(data)
      })
    )
  }, [])
 
  return (
    <div className="min-h-screen bg-[#f0f6ff] px-10 py-14">
 
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#0a1a3a]">
          My Created <span className="text-[#0a3cff]">Events</span>
        </h1>
 
        <p className="text-[#6b82a8] mt-2">
          Manage and track your events here.
        </p>
      </div>
 
      {/* Empty state */}
      {events.length === 0 && (
        <div className="bg-white border border-[#dae4f5] rounded-2xl p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a]">
            No Events Created Yet
          </h2>
 
          <p className="text-[#6b82a8] mt-3">
            Create your first event to see it listed here.
          </p>
 
          <Link
            href="/portal/organizer/create"
            className="inline-block mt-6 bg-[#0a3cff] text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Create Event →
          </Link>
        </div>
      )}
 
      {/* Events */}
      {events.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCardForCreatedEvents
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
 
    </div>
  )
}