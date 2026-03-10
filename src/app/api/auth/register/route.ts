// Routes for Register    
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
 
export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, role } = body
 
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
 
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })
 
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }
 
  const hashedPassword = await bcrypt.hash(password, 10)
 
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  })
 
  return NextResponse.json({ message: "User created" })
}