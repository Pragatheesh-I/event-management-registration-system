// Routes -> //api/events -> Get List of All Events (Unprotected Route for Public View) -> Aswath
import { $Enums } from "@/generated/prisma";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
interface Event{
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
}[]

export async function GET() {
  const events : Event[] = await prisma.event.findMany({
    where: { isPrivate: false }
  })
  return NextResponse.json(events)
} 