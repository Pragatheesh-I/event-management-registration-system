// this is Event Details Page for Public View of Specific Event

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(setEvent)
  }, [id])

  async function register() {

  try {

    const res = await fetch(`/api/events/${id}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await res.json()

    if (res.status === 401) {
      alert("Please login first to register")
      window.location.href = "/login"
      return
    }

    if (res.status === 403) {
      alert("Only users can register for events")
      return
    }

    if (!res.ok) {
      alert(data.error || "Registration failed")
      return
    }

    alert("Successfully Registered!")

  } catch (error) {
    alert("Something went wrong. Please try again.")
  }

}

  if (!event) return null

  return (
    <div className="min-h-[80vh] flex items-center justify-center">

      <div className="max-w-3xl w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-10 rounded-2xl shadow-xl">

        {/* Title */}
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          {event.title}
        </h1>

        {/* Location */}
        <p className="mt-4 text-slate-400 text-sm">
          📍 {event.location}
        </p>

        {/* Description */}
        <p className="mt-6 text-slate-300 leading-relaxed">
          {event.description}
        </p>

        {/* Register Button */}
        <button
          onClick={register}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-indigo-500/20 transition duration-300"
        >
          Register for Event →
        </button>

      </div>
    </div>
  )
}
