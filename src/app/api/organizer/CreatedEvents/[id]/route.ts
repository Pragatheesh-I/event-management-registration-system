import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      attendees: {
        include: { user: true }
      }
    }
  })

  return NextResponse.json(event)
}