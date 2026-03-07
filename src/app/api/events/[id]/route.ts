import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: true,
      attendees: {
        include: {
          user: true,
        },
      },
    },
  })

  return NextResponse.json(event)
}