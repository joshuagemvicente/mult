import { prisma } from "~/lib/prisma";
import { useNavigate } from "react-router";
import { CreateProductForm } from "~/components/products/CreateProductForm";
import { Dialog } from "~/components/ui/dialog";
import type { Route } from "./+types/add";
import { CreateProductSchema } from "~/dtos/products/createProduct.dto";
import { parseWithZod } from "@conform-to/zod";
import { dataWithError, redirectWithSuccess } from "remix-toast";

export default function AddProduct() {
  const navigate = useNavigate();
  return (
    <Dialog modal defaultOpen={true} onOpenChange={(open) => !open && navigate(-1)}>
      <CreateProductForm />
    </Dialog>
  )
}


export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: CreateProductSchema });

  if (submission.status !== "success") {
    return submission.reply()
  }
  const { name, price, sku, stock, description, brand, imageUrl } = submission.value

  const existingProduct = await prisma.product.findFirst({
    where: {
      name,
      sku
    }
  })

  if (existingProduct) {
    return dataWithError(null, "This product already exists.")
  }

  await prisma.product.create({
    data: {
      name,
      price,
      sku,
      stock,
      description,
      brand,
      imageUrl
    }
  })

  return redirectWithSuccess("/dashboard/products", "Product has been created successfully.")
};
