// app/api/user/me/route.ts
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    // ✅ Read cookie directly from headers
    const cookieHeader = req.headers.get("cookie") || ""
    const tokenMatch = cookieHeader.match(/token=([^;]+)/)
    const token = tokenMatch?.[1]

    if (!token) {
      return NextResponse.json(null)
    }

    const decoded: any = await verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    

    // console.log("Fetched user:", user)

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    return NextResponse.json(null)
  }
}