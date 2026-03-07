// Route - > /api/events/search (Search for events based on query parameters)
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const { code } = await req.json()
 
  const event = await prisma.event.findFirst({
    where: { privateCode: code }
  })
 
  return NextResponse.json(event)
}