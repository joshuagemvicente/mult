import { z } from "zod"
import { emailSchema, passwordSchema } from "./auth.dto"

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
