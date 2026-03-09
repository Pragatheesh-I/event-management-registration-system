import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const user: any = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description, type, isPrivate, location, eventDate } =
      await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    // Normalize eventDate: accept ISO string or Date, convert empty/invalid -> null
    let parsedEventDate: Date | null = null;
    if (eventDate && typeof eventDate === "string" && eventDate.trim() !== "") {
      const d = new Date(eventDate);
      if (!isNaN(d.getTime())) parsedEventDate = d;
    }

    // Ensure isPrivate is correctly set when client sends type="PRIVATE"
    const finalIsPrivate = (String(type).toUpperCase() === "PRIVATE") || Boolean(isPrivate);

    const privateCode = finalIsPrivate
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : null;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type: String(type).toUpperCase() === "PRIVATE" ? "PRIVATE" : "PUBLIC",
        isPrivate: finalIsPrivate,
        privateCode,
        organizerId: user.id,
        createdBy: user.id,
        location,
        eventDate: parsedEventDate,
      },
    });

    return NextResponse.json(event);
  } catch (err: any) {
    console.error("/api/organizer/create error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
