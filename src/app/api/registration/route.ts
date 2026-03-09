// Routes -> All Events Current User is Registered For (Protected Route for User Dashboard)
import prisma from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { NextResponse } from "next/server"
export async function GET(req: any) {
  const user: any = await getUserFromRequest(req)

  const events = await prisma.attendance.findMany({
    where: { userId: user.id },
    include: { event: true }
  })

  return NextResponse.json(events)
}