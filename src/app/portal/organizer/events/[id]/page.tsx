"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
 
const COLORS: { [key: string]: string } = {
  PRESENT: "#22c55e",
  ABSENT: "#ef4444",
  NOT_MARKED: "#64748b",
};
 
export default function EventDashboard() {
  const params = useParams();
  const id = params?.id as string;
 
  const [event, setEvent] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 
  async function fetchData() {
    try {
      const eventRes = await fetch(`/api/organizer/CreatedEvents/${id}`);
      const eventData = await eventRes.json();
 
      const analyticsRes = await fetch(
        `/api/organizer/CreatedEvents/${id}/analytics`
      );
      const analyticsData = await analyticsRes.json();
 
      setEvent(eventData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
 
  useEffect(() => {
    if (id) fetchData();
  }, [id]);
 
  async function markAttendance(attendanceId: string, status: string) {
    await fetch("/api/organizer/attendance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceId, status }),
    });
 
    setEvent((prev: any) => ({
      ...prev,
      attendees: prev.attendees.map((a: any) =>
        a.id === attendanceId ? { ...a, status } : a
      ),
    }));
 
    fetchData();
  }
 
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f6ff] px-10 py-14">
        <p className="text-[#6b82a8]">Loading event...</p>
      </div>
    );
  }
 
  const present = analytics.find((a) => a.status === "PRESENT")?.count || 0;
  const absent = analytics.find((a) => a.status === "ABSENT")?.count || 0;
  const notMarked =
    analytics.find((a) => a.status === "NOT_MARKED")?.count || 0;
 
  const total = present + absent + notMarked;
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;
 
  return (
    <div className="min-h-screen bg-[#f0f6ff] px-10 py-14 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#0a1a3a]">
          {event.title}
        </h1>
        <p className="text-[#6b82a8] mt-2">
          Monitor registrations and track attendance for this event.
        </p>
      </div>
 
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#dae4f5] p-5 rounded-2xl shadow-sm">
          <p className="text-[#6b82a8] text-sm">Total Registered</p>
          <h2 className="text-2xl font-bold text-[#0a1a3a]">{total}</h2>
        </div>
 
        <div className="bg-white border border-[#dae4f5] p-5 rounded-2xl shadow-sm">
          <p className="text-[#6b82a8] text-sm">Present</p>
          <h2 className="text-2xl font-bold text-green-600">{present}</h2>
        </div>
 
        <div className="bg-white border border-[#dae4f5] p-5 rounded-2xl shadow-sm">
          <p className="text-[#6b82a8] text-sm">Absent</p>
          <h2 className="text-2xl font-bold text-red-500">{absent}</h2>
        </div>
 
        <div className="bg-white border border-[#dae4f5] p-5 rounded-2xl shadow-sm">
          <p className="text-[#6b82a8] text-sm">Attendance Rate</p>
          <h2 className="text-2xl font-bold text-[#0a3cff]">
            {attendanceRate}%
          </h2>
        </div>
      </div>
 
      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a] mb-4">
            Attendance Distribution
          </h2>
 
          <PieChart width={350} height={300}>
            <Pie
              data={analytics}
              dataKey="count"
              nameKey="status"
              outerRadius={110}
              label
            >
              {analytics.map((entry: any, index: number) => (
                <Cell key={index} fill={COLORS[entry.status]} />
              ))}
            </Pie>
 
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
 
        <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a1a3a] mb-4">
            Attendance Comparison
          </h2>
 
          <BarChart width={400} height={300} data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
 
            <Bar dataKey="count">
              {analytics.map((entry: any, index: number) => (
                <Cell key={index} fill={COLORS[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
 
      {/* Progress */}
      <div className="bg-white border border-[#dae4f5] p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-[#0a1a3a] mb-4">
          Attendance Progress
        </h2>
 
        <div className="w-full bg-[#dbe7fb] rounded-full h-4">
          <div
            className="bg-[#0a3cff] h-4 rounded-full"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
 
        <p className="text-sm mt-2 text-[#6b82a8]">
          {attendanceRate}% of attendees are present
        </p>
      </div>
 
      {/* Attendance Table */}
      <div className="bg-white border border-[#dae4f5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#0a1a3a] mb-6">
          Mark Attendance
        </h2>
 
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#e5edf9] text-[#6b82a8]">
                <th className="py-3">Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
 
            <tbody>
              {event.attendees.map((a: any) => (
                <tr key={a.id} className="border-b border-[#eef3fb]">
                  <td className="py-4 text-[#0a1a3a] font-medium">
                    {a.user.name}
                  </td>
 
                  <td className="font-medium">
                    <span
                      className={`${
                        a.status === "PRESENT"
                          ? "text-green-600"
                          : a.status === "ABSENT"
                          ? "text-red-500"
                          : "text-[#6b82a8]"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
 
                  <td className="space-x-2">
                    {a.status === "NOT_MARKED" && (
                      <>
                        <button
                          onClick={() => markAttendance(a.id, "PRESENT")}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                        >
                          Mark Present
                        </button>
 
                        <button
                          onClick={() => markAttendance(a.id, "ABSENT")}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                        >
                          Mark Absent
                        </button>
                      </>
                    )}
 
                    {a.status === "PRESENT" && (
                      <span className="text-green-600 font-semibold">
                        ✓ Marked Present
                      </span>
                    )}
 
                    {a.status === "ABSENT" && (
                      <span className="text-red-500 font-semibold">
                        ✗ Marked Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 