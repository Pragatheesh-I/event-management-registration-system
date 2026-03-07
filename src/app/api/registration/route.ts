// Routes -> All Events Current User is Registered For (Protected Route for User Dashboard)
import prisma from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { NextResponse } from "next/server"

export async function POST(req: any) {
  const user: any = getUserFromRequest(req)
  if (user.role !== "USER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { eventId } = await req.json()

  const attendance = await prisma.attendance.create({
    data: { userId: user.id, eventId }
  })

  return NextResponse.json(attendance)
}