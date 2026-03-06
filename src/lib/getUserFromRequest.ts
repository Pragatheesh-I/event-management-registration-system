import { verifyToken } from "./auth"

export function getUserFromRequest(req: any) {
  const token = req.cookies.get("token")?.value
  if (!token) throw new Error("Unauthorized")

  return verifyToken(token)
}