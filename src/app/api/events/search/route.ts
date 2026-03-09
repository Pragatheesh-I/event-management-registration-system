import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
 
export async function POST(req: Request) {
  try {
 
    const body = await req.json()
    const { code } = body
 
    if (!code) {
      return NextResponse.json(
        { error: "Private code required" },
        { status: 400 }
      )
    }
 
    const event = await prisma.event.findUnique({
      where: { privateCode: code }
    })
 
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }
 
    return NextResponse.json(event)
 
  } catch (error) {
 
    console.error(error)
 
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
 