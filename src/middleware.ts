import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth" 

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // 1. Unauthenticated check
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const user: any = await verifyToken(token)

    // 2. Role-Based Authorization
    const isOrganizerRoute = pathname.startsWith("/portal/organizer")
    const isUserRoute = pathname.startsWith("/portal/user")

    if (isOrganizerRoute && user.role !== "ORGANIZER") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (isUserRoute && user.role !== "USER") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If token is invalid or expired
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/portal/:path*",
  ],
}
