// app/api/dashboard/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { AttendanceStatus, EventType } from "@/generated/prisma";

export async function GET(req: Request) {

  /* ───────────── SESSION AUTH ───────────── */

  let sessionOrganizerId: string | null = null;

  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const cookies: Record<string, string> = {};
    for (const part of cookieHeader.split(";")) {
      const [key, ...rest] = part.trim().split("=");
      cookies[key.trim()] = rest.join("=").trim();
    }

    const token = cookies["token"];

    if (token) {
      const payload = await verifyToken(token);

      sessionOrganizerId =
        (payload.id as string) ||
        (payload.userId as string) ||
        (payload.sub as string) ||
        null;
    }

  } catch (err) {
    console.warn("[dashboard/GET] JWT verify failed:", err);
  }

  /* ───────────── QUERY FALLBACK ───────────── */

  const { searchParams } = new URL(req.url);
  const queryId = searchParams.get("organizerId");

  const organizerId = sessionOrganizerId ?? queryId;

  if (!organizerId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  /* ───────────── FETCH EVENTS ───────────── */

  try {

    const rawEvents = await prisma.event.findMany({
      where: { organizerId: organizerId },
      select: {
        id: true,
        title: true,
        type: true,
        attendees: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    /* ───────────── DATA TRANSFORMATION ───────────── */

    const events = rawEvents.map((event) => {

      const total = event.attendees.length;

      const present = event.attendees.filter(
        (a) => a.status === AttendanceStatus.PRESENT
      ).length;

      const absent = event.attendees.filter(
        (a) => a.status === AttendanceStatus.ABSENT
      ).length;

      const notMarked = event.attendees.filter(
        (a) => a.status === AttendanceStatus.NOT_MARKED
      ).length;

      const type =
        event.type === EventType.PUBLIC
          ? "public"
          : "private";

      return {
        id: event.id,
        title: event.title,
        type: type,
        total: total,
        present: present,
        absent: absent,
        notMarked: notMarked,
      };

    });

    return NextResponse.json({ events });

  } catch (err) {

    console.error("[dashboard/GET]", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

  }

}