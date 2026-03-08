import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const total = await prisma.attendance.findMany({
    where: { eventId: id },
    select: { status: true }
  })

  const counts = {
    PRESENT: 0,
    ABSENT: 0,
    NOT_MARKED: 0
  }

  total.forEach(a => {
    counts[a.status]++
  })

  const data = [
    { status: "PRESENT", count: counts.PRESENT },
    { status: "ABSENT", count: counts.ABSENT },
    { status: "NOT_MARKED", count: counts.NOT_MARKED }
  ]

  return NextResponse.json(data)
}