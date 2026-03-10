
import { verifyToken } from "./auth"


export async function getUserFromRequest(req: Request) {

  const cookieHeader = req.headers.get("cookie") || ""

  const tokenMatch = cookieHeader.match(/token=([^;]+)/)
  const token = tokenMatch?.[1]

  // No token
  if (!token) return null

  try {
    const user = await verifyToken(token)
    return user
  } catch {
    return null
  }

}