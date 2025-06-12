import { z } from "zod"

export const nameSchema = z.string().min(3, "Name is required.")
export const emailSchema = z.string().email().min(3, "Email is required.")
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters long.")

