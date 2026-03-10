import { z } from "zod"
 
export const eventSchema = z.object({
 title: z.string().min(3, "Title must be at least 3 characters"),
 description: z.string().min(10, "Description too short"),
 type: z.enum(["PUBLIC", "PRIVATE"]),
 isPrivate :z.boolean(),
 location: z.string().min(3),
 eventDate :z.string()
})
 