// Routes -> /api/events/[id]/register (Register for a specific event by ID)
import prisma from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { NextResponse } from "next/server"
import { $Enums } from "@/generated/prisma";

interface Attendance {
    id: string;
    userId: string;
    eventId: string;
    status: $Enums.AttendanceStatus;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const user = await getUserFromRequest(req)

   // Not logged in
  if (!user) {
    return NextResponse.json(
      { error: "Please login first" },
      { status: 401 }
    )
  }

  if (user.role !== "USER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } : { id: string } = await context.params

  const attendance :Attendance = await prisma.attendance.create({
    data: {
      userId : user.id as string,
      eventId: id
    }
  })

  return NextResponse.json(attendance)
}