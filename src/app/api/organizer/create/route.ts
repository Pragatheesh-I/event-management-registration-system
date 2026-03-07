import prisma from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { NextResponse } from "next/server"

export async function POST(req: any) {
  const user: any = await getUserFromRequest(req)
  console.log(user)
  if (user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { title, description, type, isPrivate } = await req.json()

  const privateCode = isPrivate
    ? Math.random().toString(36).substring(2, 8).toUpperCase()
    : null

  const event = await prisma.event.create({
    data: {
      title,
      description,
      type,
      isPrivate,
      privateCode,
      organizerId: user.id,
      createdBy: user.id
    }
  })

  return NextResponse.json(event)
}