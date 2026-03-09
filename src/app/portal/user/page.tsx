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
 Track the events you have joined and their current status.
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
 
 {/* Events */}
 {events.length > 0 && (
 <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 
 {events.map((item) => (
 <div
 key={item.id}
 className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm hover:shadow-md transition"
 >
 {/* Event Title */}
 <h3 className="text-lg font-semibold text-[#0a1a3a]">
 {item.event.title}
 </h3>
 
 {/* Status */}
 <p className="mt-3 text-sm text-[#6b82a8]">
 Status:{" "}
 <span
 className={`font-semibold ${
 item.status === "PRESENT"
 ? "text-green-600"
 : item.status === "ABSENT"
 ? "text-red-500"
 : "text-yellow-500"
 }`}
 >
 {item.status}
 </span>
 </p>
 
 {/* Date */}
 {item.event.eventDate && (
 <p className="mt-2 text-sm text-[#6b82a8]">
 📅 {new Date(item.event.eventDate).toLocaleDateString()}
 </p>
 )}
 
 {/* Location */}
 {item.event.location && (
 <p className="mt-1 text-sm text-[#6b82a8]">
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
 