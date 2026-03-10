import Link from "next/link";
import toast from "react-hot-toast";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    location?: string;
    description?: string;
    eventDate?: string;
    type?: "PUBLIC" | "PRIVATE";
    isPrivate?: boolean;
    privateCode:string
  };
}


export default function EventCard({ event }: EventCardProps) {

  const copyCode = () => {
    toast.success("Private Code Copied Sucessfully")
    navigator.clipboard.writeText(event.privateCode)
  }
 
  const handleDelete = async () => {
      const res = await fetch(`/api/events/${event.id}`, {
      method: "DELETE"
  })
  if (res.ok) {
    toast.success("Deleted Successful")
    setTimeout(()=>{
        window.location.reload()
    },1000)
  }
}
 
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Coming soon";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[26px] border border-[#dbe6f6] bg-white p-5 shadow-[0_10px_28px_rgba(30,64,175,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#bfd4ff] hover:shadow-[0_18px_40px_rgba(10,60,255,0.14)]">
      <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#0a3cff]/[0.07] blur-3xl transition duration-300 group-hover:bg-[#0a3cff]/[0.12]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0a3cff] via-[#1a6fff] to-[#79a8ff]" />

      <div className="relative z-10">
        {/* Top */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] text-white shadow-[0_8px_20px_rgba(10,60,255,0.22)]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] ${
              event.isPrivate
                ? "border border-[#ffd9a8] bg-[#fff4e8] text-[#b96a00]"
                : "border border-[#bde7cb] bg-[#eefbf3] text-[#1f8a4d]"
            }`}
          >
            {event.isPrivate ? "PRIVATE" : "PUBLIC"}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-[1.22rem] font-bold leading-[1.25] tracking-tight text-[#0a1a3a]">
          {event.title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-3 text-[0.95rem] leading-8 text-[#6f87aa]">
          {event.description ||
            "Explore event details, venue information, and registration access in one place."}
        </p>

        {event.isPrivate && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-gray-600">
              Private Code:
              <span className="font-semibold ml-1">{event.privateCode}</span>
            </span>
            <button
            onClick={copyCode}
            className="text-blue-600 text-xs hover:underline">
              Copy
            </button>
          </div>
        )}
 

        {/* Meta */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e6eefb] bg-[#f8fbff] px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0a3cff] shadow-sm">
              📍
            </div>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#93a8c5]">
                Location
              </p>
              <p className="truncate text-[0.94rem] font-medium text-[#23406a]">
                {event.location || "Location to be announced"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#e6eefb] bg-[#f8fbff] px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0a3cff] shadow-sm">
              📅
            </div>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#93a8c5]">
                Date
              </p>
              <p className="text-[0.94rem] font-medium text-[#23406a]">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="relative z-10 mt-4 border-t border-[#edf3fc] pt-4">
        <Link
          href={`/portal/organizer/events/${event.id}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] px-5 py-3 text-[0.95rem] font-semibold text-white shadow-[0_8px_20px_rgba(10,60,255,0.20)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(10,60,255,0.28)]"
        >
          View Details
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
      <div className="mt-3 flex justify-start">
  <button
    onClick={handleDelete}
    className="inline-block  bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
  >
    Delete
  </button>
</div>
 
    </div>
  );
}