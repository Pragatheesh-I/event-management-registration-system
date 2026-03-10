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
 
export async function DELETE(
req: Request,
context: { params: Promise<{ id: string }> }
) {
try {
  const { id } = await context.params
  await prisma.event.delete({
   where: {id}
  })
 
  return NextResponse.json({ message: "Event deleted" })
 
} catch (error) {
  return NextResponse.json({ error: "Delete failed" }, { status: 500 })
}
}