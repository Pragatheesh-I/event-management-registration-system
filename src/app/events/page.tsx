// This is the Events Page for Public View of All Events -> Aswath
"use client";

import { useEffect, useState } from "react" ;
import EventCard from "@/components/EventCard";

interface Event {
  id: string;
  title: string;
  location?: string;
  description?: string;
  eventDate?: string;
  type?: "PUBLIC" | "PRIVATE";
  isPrivate?: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/events");
        console.log("API Response:", res);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load events");

        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  async function searchPrivate() {
    if (!code.trim()) {
      setError("Please enter a private event code.");
      return;
    }

    try {
      setSearching(true);
      setError("");

      const res = await fetch("/api/events/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok || !data) {
        setEvents([]);
        setError("No private event found for this code.");
        return;
      }

      setEvents([data]);
    } catch (err) {
      console.error(err);
      setEvents([]);
      setError("Something went wrong while searching.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f6ff]">
      <div className="w-full px-10 pt-4 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[2.6rem] md:text-[3rem] font-extrabold tracking-tight text-[#0a1a3a]">
            Explore <span className="text-[#0a3cff]">Events</span>
          </h1>
          <p className="mt-3 text-[1rem] text-[#6b82a8] leading-relaxed whitespace-nowrap">
            Browse public events or search with a private event code to find your
            exclusive access event.
          </p>
        </div>

        {/* Search Section */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#d9e6fb] bg-white px-5 py-5 md:px-6 md:py-6 shadow-[0_10px_30px_rgba(30,64,175,0.08)] mb-10">
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#0a3cff]/[0.06] blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#1a6fff]/[0.06] blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#90a8c8] pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 21l-4.35-4.35" />
                  <circle cx="11" cy="11" r="6" />
                </svg>
              </span>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Search private event by access code"
                className="w-full pl-[46px] pr-4 py-[15px] bg-[#f7fbff] border-[1.5px] border-[#dae4f5] rounded-xl text-[0.95rem] text-[#0a1a3a] placeholder-[#b0c4de] outline-none transition duration-200 focus:border-[#0a3cff] focus:ring-4 focus:ring-[#0a3cff]/[0.08]"
              />
            </div>

            <button
              onClick={searchPrivate}
              disabled={searching}
              className="md:min-w-[180px] flex items-center justify-center gap-2 py-[15px] px-6 bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] text-white rounded-xl text-base font-semibold tracking-wide shadow-[0_4px_20px_rgba(10,60,255,0.25)] transition-all duration-150 hover:enabled:-translate-y-px hover:enabled:shadow-[0_6px_28px_rgba(10,60,255,0.35)] active:enabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {searching && (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {searching ? "Searching..." : "Search →"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-[10px] bg-[#fff0f0] border border-[#ffc0c0] text-[0.875rem] text-[#cc2200]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-[#6b82a8] text-[1rem]">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-[#dae4f5] bg-white p-10 text-center text-[#6b82a8] shadow-sm">
            No events found.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}