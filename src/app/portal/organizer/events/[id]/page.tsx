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

const COLORS: any = {
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
        `/api/organizer/CreatedEvents/${id}/analytics`,
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
        a.id === attendanceId ? { ...a, status } : a,
      ),
    }));

    fetchData();
  }

  if (loading) return <p>Loading event...</p>;

  const present = analytics.find((a) => a.status === "PRESENT")?.count || 0;
  const absent = analytics.find((a) => a.status === "ABSENT")?.count || 0;
  const notMarked =
    analytics.find((a) => a.status === "NOT_MARKED")?.count || 0;

  const total = present + absent + notMarked;
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">{event.title}</h1>

      {/* Stats Cards */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-5 rounded-xl">
          <p className="text-slate-400 text-sm">Total Registered</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          <p className="text-slate-400 text-sm">Present</p>
          <h2 className="text-2xl font-bold text-green-400">{present}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          <p className="text-slate-400 text-sm">Absent</p>
          <h2 className="text-2xl font-bold text-red-400">{absent}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          <p className="text-slate-400 text-sm">Attendance Rate</p>
          <h2 className="text-2xl font-bold text-indigo-400">
            {attendanceRate}%
          </h2>
        </div>
      </div>

      {/* Charts Section */}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart */}

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Attendance Distribution</h2>

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

        {/* Bar Chart */}

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Attendance Comparison</h2>

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

      {/* Attendance Progress */}

      <div className="bg-slate-900 p-6 rounded-xl">
        <h2 className="text-xl mb-4">Attendance Progress</h2>

        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>

        <p className="text-sm mt-2 text-slate-400">
          {attendanceRate}% of attendees are present
        </p>
      </div>

      {/* Attendance Table */}

      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-xl mb-6">Mark Attendance</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th className="py-2">Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {event.attendees.map((a: any) => (
              <tr key={a.id} className="border-b border-slate-800">
                <td className="py-3">{a.user.name}</td>

                <td className="font-medium">{a.status}</td>

                <td className="space-x-2">
                  {a.status === "NOT_MARKED" && (
                    <>
                      <button
                        onClick={() => markAttendance(a.id, "PRESENT")}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                      >
                        Mark Present
                      </button>

                      <button
                        onClick={() => markAttendance(a.id, "ABSENT")}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Mark Absent
                      </button>
                    </>
                  )}

                  {a.status === "PRESENT" && (
                    <span className="text-green-400 font-semibold">
                      ✓ Marked Present
                    </span>
                  )}

                  {a.status === "ABSENT" && (
                    <span className="text-red-400 font-semibold">
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
  );
}
