// Route -> api/dashboard (Get dashboard data for both Users and Organizers)
// app/api/dashboard/route.ts
// NOTE: In production, replace organizerId query param with your auth session.
// e.g. import { getServerSession } from "next-auth" and use session.user.id

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AttendanceStatus, EventType } from "@/generated/prisma";
import { format, subDays } from "date-fns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const organizerId = searchParams.get("organizerId");

  // ── Auth guard ──────────────────────────────────────────────────────
  // TODO: replace this block with real session auth
  if (!organizerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ── Basic counts ──────────────────────────────────────────────────
    const [
      totalEvents,
      publicEvents,
      privateEvents,
      totalRegistrations,
      presentCount,
      absentCount,
    ] = await Promise.all([
      prisma.event.count({ where: { createdBy: organizerId } }),

      prisma.event.count({
        where: { createdBy: organizerId, type: EventType.PUBLIC },
      }),

      prisma.event.count({
        where: { createdBy: organizerId, type: EventType.PRIVATE },
      }),

      prisma.registration.count({
        where: { event: { createdBy: organizerId } },
      }),

      prisma.registration.count({
        where: {
          event: { createdBy: organizerId },
          attendanceStatus: AttendanceStatus.PRESENT,
        },
      }),

      prisma.registration.count({
        where: {
          event: { createdBy: organizerId },
          attendanceStatus: AttendanceStatus.ABSENT,
        },
      }),
    ]);

    const notMarkedCount = totalRegistrations - presentCount - absentCount;

    const attendanceRate =
      totalRegistrations > 0
        ? Math.round((presentCount / totalRegistrations) * 10000) / 100
        : 0;

    // ── Repeat attendees ──────────────────────────────────────────────
    // Users registered for MORE than 1 event hosted by this organizer
    const repeatAttendeesRaw = await prisma.registration.groupBy({
      by: ["userId"],
      _count: { _all: true },
      where: { event: { createdBy: organizerId } },
    });
    const repeatAttendees = repeatAttendeesRaw.filter(
      (a) => a._count._all > 1
    ).length;

    // ── Registrations by day (last 30 days) ──────────────────────────
    const since = subDays(new Date(), 30);
    const recentRegistrations = await prisma.registration.findMany({
      where: {
        event: { createdBy: organizerId },
        createdAt: { gte: since },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Aggregate by day
    const regByDayMap: Record<string, number> = {};
    recentRegistrations.forEach((r) => {
      const day = format(r.createdAt, "MMM dd");
      regByDayMap[day] = (regByDayMap[day] ?? 0) + 1;
    });
    // Fill every day in range
    const registrationsByDay = Array.from({ length: 30 }, (_, i) => {
      const day = format(subDays(new Date(), 29 - i), "MMM dd");
      return { date: day, count: regByDayMap[day] ?? 0 };
    });

    // ── Attendance per event (top 10 events) ─────────────────────────
    const events = await prisma.event.findMany({
      where: { createdBy: organizerId },
      select: {
        id: true,
        title: true,
        registrations: {
          select: { attendanceStatus: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const attendanceByEvent = events.map((e) => ({
      title: e.title.length > 18 ? e.title.slice(0, 17) + "…" : e.title,
      present: e.registrations.filter(
        (r) => r.attendanceStatus === AttendanceStatus.PRESENT
      ).length,
      absent: e.registrations.filter(
        (r) => r.attendanceStatus === AttendanceStatus.ABSENT
      ).length,
      notMarked: e.registrations.filter(
        (r) => r.attendanceStatus === AttendanceStatus.NOT_MARKED
      ).length,
    }));

    // ── Response ──────────────────────────────────────────────────────
    return NextResponse.json({
      totalEvents,
      publicEvents,
      privateEvents,
      totalRegistrations,
      attendanceRate,
      presentCount,
      absentCount,
      notMarkedCount,
      repeatAttendees,
      registrationsByDay,
      attendanceByEvent,
    });
  } catch (err) {
    console.error("[dashboard/GET]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}