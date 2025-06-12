import { z } from "zod"

export const BaseProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().min(0, "Price must be a non-negative number"),
  stock: z.number().min(0, "Stock must be a non-negative number").default(0),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
})

export type ProductDTO = z.infer<typeof BaseProductSchema>
