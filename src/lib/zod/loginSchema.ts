import { z } from "zod"
 
export const loginSchema = z.object({
    email:z.email({ pattern: z.regexes.email }),
    password:z.string().min(1,{message:"Password is required"})
                       .min(8,{message:"Password must be atleast 8 characters"})
                       .max(20,{message:"Password is too long"})
})
 