// Routes -> /api/events/[id]/register (Register for a specific event by ID)
import prisma from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const user: any = await getUserFromRequest(req)

  if (user.role !== "USER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await context.params

  const attendance = await prisma.attendance.create({
    data: {
      userId: user.id,
      eventId: id
    }
  })

  return NextResponse.json(attendance)
}