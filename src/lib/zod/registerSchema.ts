import { z } from "zod"
 
export const registerSchema = z.object({
    name :z.coerce.string().min(1,{message:"Name is Required"}),
    email:z.email({ pattern: z.regexes.email }),
    password:z.string().min(1,{message:"Password is required"})
                       .min(8,{message:"Password must be atleast 8 characters"})
                       .max(20,{message:"Password is too long"}),
    role: z.enum(["USER","ORGANIZER"]),

})
 