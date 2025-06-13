import { useState } from "react"
import { DataTable } from "../shared/data-table"
import { columns } from "../../columns/products.columns"
import type { ProductTableColumns } from "../../columns/products.columns" 

export function ClientSideDataTable() {
  // Generate mock data
  const mockData: ProductTableColumns[] = Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 10000) / 100,
    stock: Math.floor(Math.random() * 100),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Products Table (Client-Side Pagination)</h2>
      <DataTable
        columns={columns}
        data={mockData}
        caption="List of products with client-side pagination"
      />
    </div>
  )
} 