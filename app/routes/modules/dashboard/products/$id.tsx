import { EditProductForm } from "~/components/products/EditProductForm";
import { prisma } from "~/lib/prisma";
import type { Route } from "./+types/$id";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { Dialog } from "~/components/ui/dialog";
import { parseWithZod } from "@conform-to/zod";
import { EditProductSchema } from "~/dtos/products/editProduct.dto";

export async function loader({ params }: Route.LoaderArgs) {
  const productId = params.productId;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      select: {
        name: true,
        sku: true,
        description: true,
        brand: true,
        price: true,
        stock: true,
        imageUrl: true
      }
    });

    if (!product) {
      return dataWithError(null, "Product not found");
    }

    return {
      product,
      productId
    };
  } catch (error) {
    console.error("Error loading product:", error);
    return dataWithError(null, "Failed to load product");
  }
}

export default function ProductId() {
  const navigate = useNavigate()
  const data = useLoaderData<typeof loader>();
  const product = data?.product;
  

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Dialog modal defaultOpen={true} onOpenChange={(open) => !open && navigate(-1)}>
      <EditProductForm product={{ ...product, id: data?.productId }} />
    </Dialog>

  );
}


export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: EditProductSchema });

  if (submission.status !== "success") {
    return submission.reply()
  }

  const { name, sku } = submission.value;

  const existingProduct = await prisma.product.findFirst({
    where: {
      name,
      sku
    }
  })

  if (existingProduct) {
    return dataWithError(null, "A product with this name or SKU already exists.");
  }

  await prisma.product.update({
    where: { id: params.productId },
    data: {
      ...submission.value,
      price: Number(submission.value.price),
      stock: Number(submission.value.stock)
    }
  })

  return redirectWithSuccess(`/dashboard/products`, "Product updated successfully");

}
