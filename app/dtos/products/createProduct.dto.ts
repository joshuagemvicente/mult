import { z } from "zod"
import { BaseProductSchema } from "./product.dto"

export const CreateProductSchema = BaseProductSchema;

export type CreateProductDTO = z.infer<typeof CreateProductSchema>
