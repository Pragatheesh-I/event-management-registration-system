//  this is Event Creation Page by Organizer
// Home Page for Organizer Portal
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "PUBLIC",
    isPrivate: false,
    location: "",
    eventDate: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/organizer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.privateCode) {
      alert("Private Code: " + data.privateCode);
    }

    router.push("/events");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-8">
          Create New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-slate-400 mb-2 text-sm">
              Event Title
            </label>
            <input
              placeholder="Enter event title"
              className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 mb-2 text-sm">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Write event description..."
              className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl resize-none"
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
              className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="PUBLIC">Public Event</option>
              <option value="PRIVATE">Private Event</option>
            </select>
          </div>
          {/* Location */}
          <div>
            <label className="block text-slate-400 mb-2 text-sm">
              Location
            </label>
            <input
              placeholder="Enter event location"
              className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          {/* Date */}
          <div>
            <label className="block text-slate-400 mb-2 text-sm">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
          </div>
          {/* Private Toggle */}
          <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
            <div>
              <p className="font-medium">Private Event</p>
              <p className="text-sm text-slate-400">
                Only users with a code can join
              </p>
            </div>


          </div>

          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl font-semibold">
            Create Event →
          </button>
        </form>
      </div>
    </div>
  );
}
