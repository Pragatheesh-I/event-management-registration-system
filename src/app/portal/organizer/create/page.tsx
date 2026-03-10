//  this is Event Creation Page by Organizer
// Home Page for Organizer Portal
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { eventSchema } from "@/lib/zod/eventSchema";
import z from "zod";
interface FormData {
  title: string;
  description: string;
  type: "PUBLIC" | "PRIVATE";
  isPrivate: boolean;
  location: string;
  eventDate: string;
}
export default function CreateEvent() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    type: "PUBLIC",
    isPrivate: false,
    location: "",
    eventDate: "",
  });



  function showPrivateCodeToast(code: string) {
  toast.custom((t) => (
    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 border">
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-gray-700">
          Private Code
        </span>
        <span className="text-blue-600 font-mono text-sm">{code}</span>
      </div>

      <button
        onClick={() => {
          navigator.clipboard.writeText(code)

          toast.success("Code copied!")

          toast.dismiss(t.id)

          setTimeout(() => {
            router.push("/events")
          }, 1000)   
        }}
        className="ml-3 px-3 py-1 text-sm bg-blue-600 text-white rounded"
      >
        Copy
      </button>
    </div>
  ), {
    duration: Infinity,
  })
}
  async function handleSubmit(e: any) {
  e.preventDefault()
  const result = eventSchema.safeParse(form)

  if (!result.success){
    const error = result.error.issues[0]
    toast.error(error.message)
    return
  }else{

  try {
    const res = await fetch("/api/organizer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Failed to create event")
    }

    // Step 1: Show success
    toast.success("Event Created Successfully")

    // Step 2: Show private code after delay
    if (data.privateCode) {
      setTimeout(() => {
        showPrivateCodeToast(data.privateCode)
      }, 1200)
    } else {
      
      setTimeout(() => {
        router.push("/events")
      }, 1500)
    }

  } catch (error: any) {
    console.error(error)
    toast.error(error.message || "Something went wrong")
  }
}
}

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-2xl bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-600 mb-2 text-sm">
              Event Title
            </label>
            <input
              placeholder="Enter event title"
              value={form.title}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-md"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600 mb-2 text-sm">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Write event description..."
              value={form.description}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-md resize-none"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-slate-400 mb-2 text-sm">
              Event Type
            </label>

            <select
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-md"
              value={form.type}
              onChange={(e) => {
                const t = e.target.value;
                setForm({ ...form, type: t, isPrivate: t === "PRIVATE" });
              }}
            >
              <option value="PUBLIC">Public Event</option>
              <option value="PRIVATE">Private Event</option>
            </select>
          </div>
          {/* Location */}
          <div>
            <label className="block text-gray-600 mb-2 text-sm">Location</label>
            <input
              placeholder="Enter event location"
              value={form.location}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-md"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          {/* Date */}
          <div>
            <label className="block text-gray-600 mb-2 text-sm">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              value={form.eventDate}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-md"
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
          </div>

          <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-semibold">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
