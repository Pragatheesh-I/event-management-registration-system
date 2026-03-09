export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">

      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent leading-tight">
        Event Management Platform
      </h1>

      <p className="mt-6 text-slate-400 text-lg max-w-2xl">
        Create events. Join events. Track attendance.
        <br />
        Simple. Private. Powerful.
      </p>

      <div className="mt-10 flex gap-6">
        <a
          href="/events"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition duration-300"
        >
          Explore Events
        </a>

        <a
          href="/register"
          className="border border-slate-700 px-6 py-3 rounded-xl hover:bg-slate-800 transition duration-300"
        >
          Get Started
        </a>
      </div>
    </div>
  )
}