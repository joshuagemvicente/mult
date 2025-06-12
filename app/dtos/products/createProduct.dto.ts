import { z } from "zod"


export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),


})
