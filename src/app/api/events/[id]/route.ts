import { $Enums } from "@/generated/prisma/client";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

 
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
}
 
export interface Attendance {
  id: string;
  userId: string;
  eventId: string;
  status: $Enums.AttendanceStatus;
  user: User;
}
 
export interface Event {
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
 
  organizer: User;
  attendees: Attendance[];
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } : { id: string } = await context.params

  const event: Event | null = await prisma.event.findUnique({
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
  const { id } : { id: string } = await context.params
  await prisma.event.delete({
   where: {id}
  })
 
  return NextResponse.json({ message: "Event deleted" })
 
} catch (error) {
  return NextResponse.json({ error: "Delete failed" }, { status: 500 })
}
}