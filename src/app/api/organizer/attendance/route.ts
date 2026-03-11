import { $Enums } from "@/generated/prisma";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
interface UpdatedAttendance {
    id: string;
    userId: string;
    eventId: string;
    status: $Enums.AttendanceStatus;
}

export async function PATCH(req: Request) {

  const { attendanceId, status } = await req.json()

  const updated : UpdatedAttendance = await prisma.attendance.update({
    where: { id: attendanceId },
    data: { status }
  })

  return NextResponse.json(updated)
}