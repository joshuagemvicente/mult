import { z } from "zod"
import { nameSchema, emailSchema, passwordSchema } from "./auth.dto"


export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})
