// Routes -> //api/events -> Get List of All Events (Unprotected Route for Public View) -> Aswath
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
export async function GET() {
  const events = await prisma.event.findMany({
    where: { isPrivate: false }
  })
  return NextResponse.json(events)
} 