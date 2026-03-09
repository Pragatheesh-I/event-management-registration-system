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

const TEST_ORGANIZER_ID = "b540854b-9c4e-4627-82d2-2ae34efcf377";

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

const C = {
  pageBg: "#0a0a0a",
  cardBg: "#141414",
  border: "#2a2a2a",
  text: "#f5f5f5",
  muted: "#6b7280",
  dim: "#9ca3af",
  grid: "#1f1f1f",
  present: "#22c55e",
  absent: "#ef4444",
  notMarked: "#94a3b8",
  amber: "#f59e0b",
  blue: "#3b82f6",
};

const cardStyle = {
  background: C.cardBg,
  border: "1px solid " + C.border,
  borderRadius: "14px",
  padding: "24px",
};

const labelStyle = {
  fontSize: "10px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: C.muted,
  marginBottom: "18px",
  display: "block",
};

const tooltipStyle = {
  background: C.cardBg,
  border: "1px solid " + C.border,
  borderRadius: "8px",
  color: C.text,
  fontSize: "12px",
};

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const dot = payload[0].payload;

  return (
    <div style={{ ...tooltipStyle, padding: "10px 14px" }}>
      <p style={{ fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>
        {dot.title}
      </p>
      <p style={{ color: C.dim, margin: 0 }}>Registrations: {dot.x}</p>
      <p style={{ color: C.present, margin: 0 }}>Attendance: {dot.y}%</p>
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: C.pageBg,
          color: C.muted,
          fontFamily: "monospace",
          gap: "8px",
        }}
      >
        <p style={{ margin: 0 }}>Loading…</p>
        <p style={{ margin: 0, fontSize: "11px", opacity: 0.5 }}>
          {authStatus === "authenticated"
            ? "Auth: " + user?.email
            : "Auth: using test ID"}
        </p>
      </div>
    );
  }

  /* ───────────────── PAGE ───────────────── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.pageBg,
        color: C.text,
        fontFamily: "monospace",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                margin: 0,
                color: C.text,
              }}
            >
              Event Dashboard
            </h1>

            <p style={{ fontSize: "13px", color: C.muted, margin: "6px 0 0 0" }}>
              {authStatus === "authenticated"
                ? "Logged in as " + (user?.name || user?.email)
                : "Test mode — not logged in"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={handleCSV}
              style={{
                padding: "9px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 600,
                background: "transparent",
                color: C.dim,
                border: "1px solid " + C.border,
              }}
            >
              ⬇ CSV
            </button>

            <button
              onClick={handlePDF}
              disabled={exporting}
              style={{
                padding: "9px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 600,
                background: exporting ? C.muted : C.amber,
                color: "#0a0a0a",
                border: "none",
                opacity: exporting ? 0.6 : 1,
              }}
            >
              {exporting ? "Generating…" : "⬇ PDF Report"}
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div style={{ marginBottom: "28px" }}>
          <p style={{ ...labelStyle, marginBottom: "10px" }}>
            Filter by Event Type
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            {(["all", "public", "private"] as FilterType[]).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: filter === option ? C.amber : C.cardBg,
                  color: filter === option ? "#0a0a0a" : C.dim,
                  border:
                    filter === option
                      ? "none"
                      : "1px solid " + C.border,
                }}
              >
                {option === "all" && "All Events"}
                {option === "public" && "🌐 Public"}
                {option === "private" && "🔒 Private"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {[
            { label: "Total Events", value: totalEvents, color: C.text },
            {
              label: "Registrations",
              value: totalRegistrations,
              color: C.text,
            },
            {
              label: "Attendance Rate",
              value: attendanceRate,
              color: C.present,
            },
            { label: "Present", value: totalPresent, color: C.present },
            { label: "Absent", value: totalAbsent, color: C.absent },
            {
              label: "Not Marked",
              value: totalNotMarked,
              color: C.notMarked,
            },
          ].map(({ label, value, color }) => (
            <div key={label} style={cardStyle}>
              <span style={labelStyle}>{label}</span>
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: color,
                  margin: 0,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* CHART ROW 1 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >

          <div style={cardStyle}>
            <span style={labelStyle}>Attendance by Event</span>

            {events.length === 0 ? (
              <p style={{ color: C.muted, textAlign: "center", padding: "40px 0" }}>
                No {filter} events found.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={eventsForChart}
                  barCategoryGap="35%"
                  margin={{ bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                  <XAxis
                    dataKey="title"
                    interval={0}
                    tick={{ fill: C.dim, fontSize: 9 }}
                    height={40}
                  />
                  <YAxis tick={{ fill: C.dim, fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar dataKey="present" fill={C.present} radius={[4,4,0,0]} />
                  <Bar dataKey="absent" fill={C.absent} radius={[4,4,0,0]} />
                  <Bar dataKey="notMarked" fill={C.notMarked} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>Attendance Split</span>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  <Cell fill={C.present} />
                  <Cell fill={C.absent} />
                  <Cell fill={C.notMarked} />
                </Pie>

                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* CHART ROW 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          <div style={cardStyle}>
            <span style={labelStyle}>Top Events by Registrations</span>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={topByRegForChart}
                layout="vertical"
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={C.grid}
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fill: C.dim, fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="title" tick={{ fill: C.dim, fontSize: 9 }} width={130} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" fill={C.blue} radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>Registrations vs Attendance Rate</span>

            {scatterData.length === 0 ? (
              <p style={{ color: C.muted, textAlign: "center", padding: "40px 0" }}>
                No data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={195}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />

                  <XAxis
                    type="number"
                    dataKey="x"
                    tick={{ fill: C.dim, fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <YAxis
                    type="number"
                    dataKey="y"
                    tick={{ fill: C.dim, fontSize: 11 }}
                    tickFormatter={(v) => v + "%"}
                    domain={[0, 100]}
                  />

                  <ZAxis type="number" dataKey="z" range={[60, 200]} />

                  <Tooltip content={<ScatterTooltip />} />

                  <Scatter
                    name="Events"
                    data={scatterData}
                    fill={C.amber}
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