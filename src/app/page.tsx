export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-[#0a1a3a] leading-tight">
          Event Management <span className="text-[#0a3cff]">Platform</span>
        </h1>
 
        <p className="mt-6 text-[#6b82a8] text-lg leading-8">

          Create events,Join events. Track attendance.

          <br />
          Simple. Private. Powerful.
        </p>
 
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/events" className="bg-[#0a3cff] text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition">
            Explore Events
          </a>
 
          <a
            href="/register"
            className="bg-white border border-[#dae4f5] text-[#0a1a3a] px-6 py-3 rounded-xl font-semibold hover:bg-[#f8fbff] transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
}
 