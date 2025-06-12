import { z } from "zod"
import { BaseProductSchema } from "./product.dto"

export const EditProductSchema = BaseProductSchema;

export type EditProductDTO = z.infer<typeof EditProductSchema>
