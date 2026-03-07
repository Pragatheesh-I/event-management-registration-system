// This is Dashboard Page for Organizer
"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { generatePDFReport } from "@/lib/generateReport";

// ─── Default organizer for testing ───────────────────────────────────────────
const TEST_ORGANIZER_ID = "7193e61c-4ef9-4df2-a755-9535bf5c6e6e";

// ─── Colors used in charts ────────────────────────────────────────────────────
const COLORS = {
  present:   "#22c55e",
  absent:    "#ef4444",
  notMarked: "#94a3b8",
  public:    "#3b82f6",
  private:   "#a855f7",
  area:      "#f59e0b",
};

// ─── Main Dashboard Component ─────────────────────────────────────────────────
type AttendanceByEvent = {
  title: string;
  present: number;
  absent: number;
  notMarked: number;
};

type DashboardData = {
  totalEvents: number;
  totalRegistrations: number;
  attendanceRate: number;
  repeatAttendees: number;
  publicEvents: number;
  privateEvents: number;
  presentCount: number;
  notMarkedCount: number;
  absentCount: number;
  registrationsByDay: { date: string; count: number }[];
  attendanceByEvent: AttendanceByEvent[];
};

export default function DashboardPage() {
  const [data, setData]           = useState<DashboardData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch(`/api/dashboard?organizerId=${TEST_ORGANIZER_ID}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ── Download PDF ────────────────────────────────────────────────────────────
  async function handleDownloadPDF() {
    setExporting(true);
    try {
      if (data) {
        generatePDFReport(data);
      }
    } finally {
      setExporting(false);
    }
  }

  // ── Download CSV ────────────────────────────────────────────────────────────
  function handleDownloadCSV() {
    if (!data) return; // Prevent running if data is null

    // Build rows: header + one row per event
    const rows = [
      ["Event", "Present", "Absent", "Not Marked", "Total", "Attendance Rate"],
      ...data.attendanceByEvent.map((e) => {
        const total = e.present + e.absent + e.notMarked;
        const rate  = total > 0 ? ((e.present / total) * 100).toFixed(1) + "%" : "N/A";
        return [e.title, e.present, e.absent, e.notMarked, total, rate];
      }),
    ];

    // Join rows into a CSV string
    const csv  = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);

    // Create a hidden link and click it to trigger download
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `attendance-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p style={styles.center}>Loading...</p>;
  if (error)   return <p style={{ ...styles.center, color: "red" }}>Error: {error}</p>;
  if (!data)   return null;

  // Data for charts
  const attendancePie = [
    { name: "Present",    value: data.presentCount },
    { name: "Not Marked", value: data.notMarkedCount },
    { name: "Absent",     value: data.absentCount },
  ];

  const eventTypePie = [
    { name: "Public",  value: data.publicEvents },
    { name: "Private", value: data.privateEvents },
  ];

  return (
    <div style={styles.page}>

      {/* ── Header ── */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Event Dashboard</h1>
          <p style={styles.subtitle}>Organizer analytics &amp; insights</p>
        </div>

        {/* ── Export Buttons ── */}
        <div style={styles.buttonGroup}>
          <button onClick={handleDownloadCSV} style={styles.btnSecondary}>
            ⬇ CSV
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={exporting}
            style={exporting ? { ...styles.btnPrimary, opacity: 0.6 } : styles.btnPrimary}
          >
            {exporting ? "Generating..." : "⬇ PDF Report"}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={styles.kpiRow}>
        <KPICard label="Total Events"        value={data.totalEvents} />
        <KPICard label="Total Registrations" value={data.totalRegistrations} />
        <KPICard label="Attendance Rate"     value={data.attendanceRate.toFixed(1) + "%"} />
        <KPICard label="Repeat Attendees"    value={data.repeatAttendees} />
        <KPICard label="Public Events"       value={data.publicEvents} />
        <KPICard label="Private Events"      value={data.privateEvents} />
      </div>

      {/* ── Row 1: Area chart + Attendance Pie ── */}
      <div style={styles.row}>

        <div style={{ ...styles.card, flex: 2 }}>
          <h2 style={styles.cardTitle}>Registrations Over Time (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.registrationsByDay}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={COLORS.area} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.area} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={styles.tooltip} />
              <Area
                type="monotone"
                dataKey="count"
                name="Registrations"
                stroke={COLORS.area}
                fill="url(#areaGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...styles.card, flex: 1 }}>
          <h2 style={styles.cardTitle}>Attendance Breakdown</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={attendancePie} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3}>
                <Cell fill={COLORS.present} />
                <Cell fill={COLORS.notMarked} />
                <Cell fill={COLORS.absent} />
              </Pie>
              <Tooltip contentStyle={styles.tooltip} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── Row 2: Bar chart + Event Type Pie ── */}
      <div style={styles.row}>

        <div style={{ ...styles.card, flex: 2 }}>
          <h2 style={styles.cardTitle}>Attendance by Event</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.attendanceByEvent}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="title" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={styles.tooltip} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="present"   name="Present"    fill={COLORS.present}   radius={[4,4,0,0]} />
              <Bar dataKey="absent"    name="Absent"     fill={COLORS.absent}    radius={[4,4,0,0]} />
              <Bar dataKey="notMarked" name="Not Marked" fill={COLORS.notMarked} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...styles.card, flex: 1 }}>
          <h2 style={styles.cardTitle}>Event Types</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={eventTypePie}
                dataKey="value"
                outerRadius={90}
                paddingAngle={4}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                <Cell fill={COLORS.public} />
                <Cell fill={COLORS.private} />
              </Pie>
              <Tooltip contentStyle={styles.tooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
type KPICardProps = {
  label: string;
  value: string | number;
};

function KPICard({ label, value }: KPICardProps) {
  return (
    <div style={styles.kpiCard}>
      <span style={styles.kpiLabel}>{label}</span>
      <span style={styles.kpiValue}>{value}</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#020817",
    color: "#f8fafc",
    padding: "32px",
    fontFamily: "monospace",
    maxWidth: "1400px",
    margin: "0 auto",
  } as React.CSSProperties,
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
  } as React.CSSProperties,
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    marginBottom: "4px",
  } as React.CSSProperties,
  subtitle: {
    color: "#475569",
    fontSize: "13px",
  } as React.CSSProperties,
  buttonGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  } as React.CSSProperties,
  btnPrimary: {
    background: "#f59e0b",
    color: "#020817",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontFamily: "monospace",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  } as React.CSSProperties,
  btnSecondary: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "10px 20px",
    fontFamily: "monospace",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  } as React.CSSProperties,
  kpiRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  } as React.CSSProperties,
  kpiCard: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column" as "column",
    gap: "8px",
    minWidth: "160px",
    flex: 1,
  } as React.CSSProperties,
  kpiLabel: {
    fontSize: "11px",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  } as React.CSSProperties,
  kpiValue: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#f8fafc",
  } as React.CSSProperties,
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  } as React.CSSProperties,
  card: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "24px",
    minWidth: "280px",
  } as React.CSSProperties,
  cardTitle: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "20px",
  } as React.CSSProperties,
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#94a3b8",
    fontFamily: "monospace",
  } as React.CSSProperties,
  tooltip: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    color: "#f8fafc",
  } as React.CSSProperties,
};