import { SignJWT, jwtVerify } from "jose"
import { getSecret } from "@/lib/keyvault";

const secretKey = await getSecret("JWT-SECRET")

if (!secretKey) {
  throw new Error("JWT_SECRET is not defined")
}

const secret = new TextEncoder().encode(secretKey)

// ✅ Sign Token
export async function signToken(payload: { id: string; role: "USER" | "ORGANIZER" }) {
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