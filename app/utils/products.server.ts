import { data } from "react-router";
import type { CreateProductDTO } from "~/dtos/products/createProduct.dto";
import type { Pagination } from "~/types/pagination";
import { prisma } from "~/lib/prisma";
import { Prisma } from "@prisma/client";
import { dataWithError } from "remix-toast";

export type ProductFilter = {
  search?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  brand?: string;
}

export type ProductsResponse = {
  products: Awaited<ReturnType<typeof prisma.product.findMany>>;
  totalCount: number;
  totalPages: number;
}

export async function getAllProducts(
  pagination?: Pagination,
  filters?: ProductFilter
): Promise<ProductsResponse> {
  const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortOrder = "desc" } = pagination || {};

  // let where: Prisma.ProductUpsertArgswhat = {};
  let where: any = {}

  const conditions: any[] = [];

  if (filters?.search) {
    conditions.push({
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ],
    });
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    const priceFilter: any = {};
    if (filters?.minPrice !== undefined) {
      priceFilter.gte = filters.minPrice;
    }
    if (filters?.maxPrice !== undefined) {
      priceFilter.lte = filters.maxPrice;
    }
    conditions.push({ price: priceFilter });
  }

  if (filters?.minStock !== undefined || filters?.maxStock !== undefined) {
    const stockFilter: any = {};
    if (filters?.minStock !== undefined) {
      stockFilter.gte = filters.minStock;
    }
    if (filters?.maxStock !== undefined) {
      stockFilter.lte = filters.maxStock;
    }
    conditions.push({ stock: stockFilter });
  }

  if (filters?.brand) {
    conditions.push({ brand: filters.brand });
  }

  if (conditions.length > 0) {
    where = { AND: conditions };
  }

  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalCount / pageSize);

  const orderBy = {
    [sortBy]: sortOrder,
  };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
  });

  return {
    products,
    totalCount,
    totalPages,
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })

  return product ? product : data("This product does not exist.");
}

export async function getProductBySku(sku: string) {
  const product = await prisma.product.findFirst({
    where: {
      sku
    }
  });

  return product || null;
}

export async function incrementProductStockBySku(sku: string, quantity: number = 1) {
  try {
    const product = await prisma.product.findFirst({
      where: { sku }
    });

    if (!product) {
      return dataWithError(null, `Product with SKU ${sku} not found`);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        stock: product.stock + quantity
      }
    });

    return data(updatedProduct);
  } catch (error) {
    console.error("Error incrementing product stock:", error);
    return dataWithError(null, "Failed to update product stock");
  }
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
    return dataWithError(null, "This product already exists.");
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
    return dataWithError(null, "This product does not exist.")
  }

  await prisma.product.delete({
    where: {
      id
    }
  })

}

