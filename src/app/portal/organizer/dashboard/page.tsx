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
  blue: "#3b82f6",
};

const PRIMARY_BTN_CLASS = "md:min-w-[180px] flex items-center justify-center gap-2 py-[15px] px-6 bg-gradient-to-br from-[#0a3cff] to-[#1a6fff] text-white rounded-xl text-base font-semibold tracking-wide shadow-[0_4px_20px_rgba(10,60,255,0.25)] transition-all duration-150 hover:enabled:-translate-y-px hover:enabled:shadow-[0_6px_28px_rgba(10,60,255,0.35)] active:enabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed";

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const dot = payload[0].payload;

  return (
    <div className="bg-white border rounded shadow-sm p-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{dot.title}</p>
      <p className="text-gray-500">Registrations: {dot.x}</p>
      <p className="text-green-600">Attendance: {dot.y}%</p>
    </div>
  );
}

export default function DashboardPage() {

  /* ───────────────── AUTH STATE ───────────────── */
  const [user, setUser] = useState<User>(null);
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-2">
        <p className="text-lg">Loading…</p>
        <p className="text-sm opacity-60">
          {authStatus === "authenticated" ? "Auth: " + user?.email : "Auth: using test ID"}
        </p>
      </div>
    );
  }

  /* ───────────────── PAGE ───────────────── */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Event Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {authStatus === "authenticated" ? "Logged in as " + (user?.name || user?.email) : "Test mode — not logged in"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCSV} className={PRIMARY_BTN_CLASS}>
              CSV
            </button>

            <button onClick={handlePDF} disabled={exporting} className={PRIMARY_BTN_CLASS}>
              {exporting ? "Generating…" : "PDF Report"}
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Filter by Event Type</p>

          <div className="flex gap-2">
            {( ["all", "public", "private"] as FilterType[] ).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`${PRIMARY_BTN_CLASS} ${filter === option ? '' : 'opacity-90'}`}
              >
                {option === "all" && "All Events"}
                {option === "public" && "Public"}
                {option === "private" && "Private"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Events", value: totalEvents },
            { label: "Registrations", value: totalRegistrations },
            { label: "Attendance Rate", value: attendanceRate },
            { label: "Present", value: totalPresent },
            { label: "Absent", value: totalAbsent },
            { label: "Not Marked", value: totalNotMarked },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg p-4 shadow-sm border">
              <span className="text-xs font-semibold uppercase text-gray-400">{label}</span>
              <p className="text-2xl font-extrabold mt-2">{value}</p>
            </div>
          ))}
        </div>

        {/* CHART ROW 1 */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <span className="text-xs font-semibold uppercase text-gray-400">Attendance by Event</span>

            {events.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No {filter} events found.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={eventsForChart}
                  barCategoryGap="35%"
                  margin={{ bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="title"
                    interval={0}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    height={40}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar dataKey="present" fill={COLORS.present} radius={[4,4,0,0]} />
                  <Bar dataKey="absent" fill={COLORS.absent} radius={[4,4,0,0]} />
                  <Bar dataKey="notMarked" fill={COLORS.notMarked} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <span className="text-xs font-semibold uppercase text-gray-400">Attendance Split</span>

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
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <span className="text-xs font-semibold uppercase text-gray-400">Top Events by Registrations</span>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={topByRegForChart}
                layout="vertical"
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="title" tick={{ fill: '#6b7280', fontSize: 11 }} width={140} />
                <Tooltip />
                <Bar dataKey="total" fill={COLORS.blue} radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <span className="text-xs font-semibold uppercase text-gray-400">Registrations vs Attendance Rate</span>

            {scatterData.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={195}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

                  <XAxis
                    type="number"
                    dataKey="x"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <YAxis
                    type="number"
                    dataKey="y"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
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
    </div>
  );
}