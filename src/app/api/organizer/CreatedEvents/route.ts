// Routes for Fetching All the Events Created by the Organizer (Protected Route for Organizer Portal)
import prisma from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { NextResponse } from "next/server"
export async function GET(req: any) {
  const user: any = await getUserFromRequest(req)

  const events = await prisma.event.findMany({
    where: { organizerId: user.id }
  })
  

  return NextResponse.json(events)
}