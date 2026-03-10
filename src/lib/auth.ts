import { SignJWT, jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET!

if (!secretKey) {
  throw new Error("JWT_SECRET is not defined")
}

const secret = new TextEncoder().encode(secretKey)

// ✅ Sign Token
export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)
}

// ✅ Verify Token
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}