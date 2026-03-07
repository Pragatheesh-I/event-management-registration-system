import Link from "next/link"

interface EventCardProps {
  event: {
    id: string
    title: string
    location: string
  }
}
export default function EventCard({ event }: EventCardProps) {
  return (
<div className="group relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300">
 
      {/* Glow Effect */}
<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
 
      <div className="relative z-10">
<h3 className="text-xl font-bold text-indigo-400 group-hover:text-indigo-300 transition">
          {event.title}
</h3>
 
        <p className="text-slate-400 mt-2 text-sm">
           {event.location}
</p>
 
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-2 mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-xl font-medium transition duration-300 shadow-md"
>
          View Event →
</Link>
</div>
</div>
  )
}