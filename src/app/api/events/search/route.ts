import { $Enums } from "@/generated/prisma";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

interface Event {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    type: $Enums.EventType;
    isPrivate: boolean;
    privateCode: string | null;
    createdBy: string;
    location: string | null;
    eventDate: Date | null;
    organizerId: string;
} 
export async function POST(req: Request) {
  try {
 
    const body = await req.json()
    const { code } : { code: string } = body
 
    if (!code) {
      return NextResponse.json(
        { error: "Private code required" },
        { status: 400 }
      )
    }
 
    const event : Event | null = await prisma.event.findUnique({
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
 