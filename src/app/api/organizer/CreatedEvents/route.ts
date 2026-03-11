// Routes for Fetching All the Events Created by the Organizer (Protected Route for Organizer Portal)
import prisma from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/getUserFromRequest"
import { NextResponse } from "next/server"
import { $Enums } from "@/generated/prisma/client";
interface Events {
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

export async function GET(req: any) {
  const user: any = await getUserFromRequest(req)

  const events  = await prisma.event.findMany({
    where: { organizerId: user.id }
  })
  

  return NextResponse.json(events)
}