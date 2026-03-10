// app/(organizer)/dashboard/page.tsx
"use client";
 
import { useEffect, useState } from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter, ZAxis,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { generatePDFReport, generateCSVReport } from "@/lib/generateReport";
 
type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
} | null;
 
const TEST_ORGANIZER_ID = "55e6b4fb-3dd3-4618-a6d3-2ce3f3f115ba";
 
type EventRow = {
  id: string;
  title: string;
  type: "public" | "private";
  total: number;
  present: number;
  absent: number;
  notMarked: number;
};
 
type FilterType = "all" | "public" | "private";
 
const COLORS = {
  present: "#16a34a",
  absent: "#ef4444",
  notMarked: "#94a3b8",
  amber: "#f59e0b",
  blue: "#0a3cff",
};
 
function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
 
  const dot = payload[0].payload;
 
  return (
    <div className="bg-white border border-[#dae4f5] rounded-lg shadow-sm p-3 text-sm">
      <p className="font-semibold text-[#0a1a3a] mb-1">{dot.title}</p>
      <p className="text-[#6b82a8]">Registrations: {dot.x}</p>
      <p className="text-green-600">Attendance: {dot.y}%</p>
    </div>
  );
}
 
export default function DashboardPage() {
 
  /* ───────────────── AUTH STATE ───────────────── */
  const [user, setUser] = useState<User>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
 
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setUser(data);
          setAuthStatus("authenticated");
        } else {
          setUser(null);
          setAuthStatus("unauthenticated");
        }
      })
      .catch(() => {
        setUser(null);
        setAuthStatus("unauthenticated");
      });
  }, []);
 
  const organizerId =
    authStatus === "authenticated" && user?.id
      ? user.id
      : TEST_ORGANIZER_ID;
 
  /* ───────────────── DATA STATE ───────────────── */
  const [allEvents, setAllEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
 
  useEffect(() => {
    setLoading(true);
 
    fetch("/api/dashboard?organizerId=" + organizerId)
      .then((res) => res.json())
      .then((data) => {
        setAllEvents(data.events);
        setLoading(false);
      });
  }, [organizerId]);
 
  /* ───────────────── FILTERED EVENTS ───────────────── */
  const events =
    filter === "all"
      ? allEvents
      : allEvents.filter((e) => e.type === filter);
 
  let filterLabel = "All Events";
  if (filter === "public") filterLabel = "Public Events";
  if (filter === "private") filterLabel = "Private Events";
 
  /* ───────────────── KPI CALCULATIONS ───────────────── */
  const totalEvents = events.length;
 
  const totalRegistrations = events.reduce((s, e) => s + e.total, 0);
  const totalPresent = events.reduce((s, e) => s + e.present, 0);
  const totalAbsent = events.reduce((s, e) => s + e.absent, 0);
  const totalNotMarked = events.reduce((s, e) => s + e.notMarked, 0);
 
  let attendanceRate = "N/A";
  if (totalRegistrations > 0) {
    attendanceRate =
      ((totalPresent / totalRegistrations) * 100).toFixed(1) + "%";
  }
 
  /* ───────────────── CHART DATA ───────────────── */
  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
    { name: "Not Marked", value: totalNotMarked },
  ];
 
  const topByRegistrations = [...events]
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
    .map((e) => ({ title: e.title, total: e.total }));
 
  const scatterData = events
    .filter((e) => e.total > 0)
    .map((e) => ({
      title: e.title,
      x: e.total,
      y: Math.round((e.present / e.total) * 100),
      z: e.total,
    }));
 
  /* ───────────────── TITLE SHORTENER ───────────────── */
  function shortenTitle(title: string, max: number) {
    if (title.length <= max) return title;
    return title.slice(0, max - 1) + "…";
  }
 
  const eventsForChart = events.map((e) => ({
    ...e,
    title: shortenTitle(e.title, 10),
  }));
 
  const topByRegForChart = topByRegistrations.map((e) => ({
    ...e,
    title: shortenTitle(e.title, 20),
  }));
 
  /* ───────────────── EXPORT HANDLERS ───────────────── */
  async function handlePDF() {
    setExporting(true);
    generatePDFReport(events, filterLabel);
    setExporting(false);
  }
 
  function handleCSV() {
    generateCSVReport(events, filterLabel);
  }
 
  /* ───────────────── LOADING SCREEN ───────────────── */
  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f6ff] text-[#6b82a8] gap-2">
        <p className="text-lg">Loading…</p>
        <p className="text-sm opacity-60">
          {authStatus === "authenticated" ? "Auth: " + user?.email : "Auth: using test ID"}
        </p>
      </div>
    );
  }
 
  /* ───────────────── PAGE ───────────────── */
  return (
    <div className="min-h-screen bg-[#f0f6ff] px-10 py-14 space-y-10">
      
      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#0a1a3a]">Event Dashboard</h1>
          <p className="text-[#6b82a8] mt-2">
            {authStatus === "authenticated" ? "Logged in as " + (user?.name || user?.email) : "Test mode — not logged in"}
          </p>
        </div>
 
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCSV} 
            className="bg-[#0a3cff] text-white px-5 py-2.5 rounded-xl hover:bg-[#0830cc] transition font-medium shadow-sm"
          >
            Export CSV
          </button>
 
          <button 
            onClick={handlePDF} 
            disabled={exporting} 
            className="bg-[#0a3cff] text-white px-5 py-2.5 rounded-xl hover:bg-[#0830cc] transition font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {exporting ? "Generating…" : "PDF Report"}
          </button>
        </div>
      </div>
 
      {/* FILTER */}
      <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
        <p className="text-sm font-semibold text-[#0a1a3a] mb-3">Filter by Event Type</p>
 
        <div className="flex gap-3">
          {(["all", "public", "private"] as FilterType[]).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                filter === option
                  ? "bg-[#0a3cff] text-white shadow-sm"
                  : "bg-[#f0f6ff] text-[#6b82a8] hover:bg-[#dae4f5]"
              }`}
            >
              {option === "all" && "All Events"}
              {option === "public" && "Public"}
              {option === "private" && "Private"}
            </button>
          ))}
        </div>
      </div>
 
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: "Total Events", value: totalEvents },
          { label: "Registrations", value: totalRegistrations },
          { label: "Attendance Rate", value: attendanceRate },
          { label: "Present", value: totalPresent },
          { label: "Absent", value: totalAbsent },
          { label: "Not Marked", value: totalNotMarked },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#dae4f5] p-5 rounded-2xl shadow-sm">
            <p className="text-[#6b82a8] text-sm">{label}</p>
            <h2 className="text-2xl font-bold text-[#0a1a3a] mt-1">{value}</h2>
          </div>
        ))}
      </div>
 
      {/* CHART ROW 1 */}
      <div className="grid md:grid-cols-2 gap-8">
 
        <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a] mb-4">Attendance by Event</h2>
 
          {events.length === 0 ? (
            <p className="text-[#6b82a8] text-center py-10">No {filter} events found.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={eventsForChart}
                barCategoryGap="35%"
                margin={{ bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dae4f5" />
                <XAxis
                  dataKey="title"
                  interval={0}
                  tick={{ fill: '#6b82a8', fontSize: 11 }}
                  height={40}
                />
                <YAxis tick={{ fill: '#6b82a8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="Present" fill={COLORS.present} radius={[4,4,0,0]} />
                <Bar dataKey="Absent" fill={COLORS.absent} radius={[4,4,0,0]} />
                <Bar dataKey="Not Marked" fill={COLORS.notMarked} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
 
        <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a] mb-4">Attendance Split</h2>
 
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                <Cell fill={COLORS.present} />
                <Cell fill={COLORS.absent} />
                <Cell fill={COLORS.notMarked} />
              </Pie>
 
              <Tooltip />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
 
      </div>
 
      {/* CHART ROW 2 */}
      <div className="grid md:grid-cols-2 gap-8">
 
        <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a] mb-4">Top Events by Registrations</h2>
 
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={topByRegForChart}
              layout="vertical"
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#dae4f5"
                horizontal={false}
              />
              <XAxis type="number" tick={{ fill: '#6b82a8', fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="title" tick={{ fill: '#6b82a8', fontSize: 11 }} width={140} />
              <Tooltip />
              <Bar dataKey="total" fill={COLORS.blue} radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
 
        <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a] mb-4">Registrations vs Attendance Rate</h2>
 
          {scatterData.length === 0 ? (
            <p className="text-[#6b82a8] text-center py-10">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={195}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dae4f5" />
 
                <XAxis
                  type="number"
                  dataKey="x"
                  tick={{ fill: '#6b82a8', fontSize: 11 }}
                  allowDecimals={false}
                />
 
                <YAxis
                  type="number"
                  dataKey="y"
                  tick={{ fill: '#6b82a8', fontSize: 11 }}
                  tickFormatter={(v) => v + "%"}
                  domain={[0, 100]}
                />
 
                <ZAxis type="number" dataKey="z" range={[60, 200]} />
 
                <Tooltip content={<ScatterTooltip />} />
 
                <Scatter
                  name="Events"
                  data={scatterData}
                  fill={COLORS.amber}
                  fillOpacity={0.85}
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
 
      </div>
    </div>
  );
}
 
      
 