import { data } from "react-router";
import { dataWithError } from "remix-toast";
import type { CreateProductDTO } from "~/dtos/products/createProduct.dto";
import { prisma } from "~/lib/prisma";


export async function getAllProducts() {
  const products = await prisma.product.findMany()

  // tbmodified for the pagination and filter
  return products
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })

  return product ? product : data("This product does not exist.");
}


export async function createProduct(submission: CreateProductDTO) {

  const product = await prisma.product.findFirst({
    where: {
      OR: [
        {
          name: submission.name
        },
        {
          sku: submission.sku
        }
      ]
    }
  })

  if (product) {
    return data("This product already exists")
  }

  const createdProduct = await prisma.product.create({
    data: {
      ...submission,
    }
  })


  return createdProduct

}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })

  if (!product) {
    return data("This product does not exist.")
  }

  await prisma.product.delete({
    where: {
      id
    }
  })

}

