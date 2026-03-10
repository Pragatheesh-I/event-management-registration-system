// Routes for Login 
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"
import { NextResponse } from "next/server"
 
export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body

  if (!email) {
      return NextResponse.json({error : "Please Enter Email"}) 
  }
 
  const user = await prisma.user.findUnique({
    where: { email }
  })
 
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
  }
 
  const isMatch = await bcrypt.compare(password, user.password)
 
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
  }
  const token = await signToken({
    id: user.id,
    role: user.role
  })
 
  const response = NextResponse.json({ message: "Login successful" })
 
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })
  
   

  return response
}