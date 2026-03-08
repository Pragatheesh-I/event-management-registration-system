import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {

  const { attendanceId, status } = await req.json()

  const updated = await prisma.attendance.update({
    where: { id: attendanceId },
    data: { status }
  })

  return NextResponse.json(updated)
}