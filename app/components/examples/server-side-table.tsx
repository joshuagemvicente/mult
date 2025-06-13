import { useState, useEffect } from "react"
import { DataTable } from "../shared/data-table"
import { columns } from "../../columns/products.columns"
import type { ProductTableColumns } from "../../columns/products.columns" 
import type { Pagination, PaginationState } from "../../types/pagination"
import { mapPaginationToTablePagination, mapTablePaginationToPagination } from "../../types/pagination"
import { getAllProducts, type ProductFilter } from "../../utils/products.server"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Search } from "lucide-react"

export function ServerSideDataTable() {
  const [data, setData] = useState<ProductTableColumns[]>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState<ProductFilter>({
    search: "",
    minPrice: undefined,
    maxPrice: undefined,
    minStock: undefined,
    maxStock: undefined,
    brand: undefined,
  })
  const [pageCount, setPageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  // This would be your API fetch function
  const fetchData = async (pagination: PaginationState, filters: ProductFilter) => {
    setIsLoading(true)

    try {
      // Convert from TanStack table pagination to API pagination
      const apiPagination: Pagination = mapTablePaginationToPagination(pagination)
      
      // In a real application, you'd call your API here
      // For demonstration purposes, we'll simulate an API call
      const response = await getAllProducts(apiPagination, filters)
      
      setData(response.products as unknown as ProductTableColumns[])
      setPageCount(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when pagination or filters change
  useEffect(() => {
    fetchData(pagination, filters)
  }, [pagination, filters])

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
    // Reset to first page when search changes
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  // Handle price filter changes
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value)
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue
    }))
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  // Handle stock filter changes
  const handleStockChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value)
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minStock' : 'maxStock']: numValue
    }))
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: "",
      minPrice: undefined,
      maxPrice: undefined,
      minStock: undefined,
      maxStock: undefined,
      brand: undefined,
    })
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Products Table (Server-Side Pagination)</h2>
      
      <div className="bg-card p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div className="relative">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search products..."
                value={filters.search || ""}
                onChange={handleSearchChange}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Price range filters */}
          <div>
            <Label>Price Range</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice ?? ""}
                onChange={(e) => handlePriceChange('min', e.target.value)}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice ?? ""}
                onChange={(e) => handlePriceChange('max', e.target.value)}
              />
            </div>
          </div>
          
          {/* Stock range filters */}
          <div>
            <Label>Stock Level</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minStock ?? ""}
                onChange={(e) => handleStockChange('min', e.target.value)}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxStock ?? ""}
                onChange={(e) => handleStockChange('max', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `Showing ${totalCount} products`}
          </div>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={pageCount}
        caption={isLoading ? "Loading data..." : "List of products"}
      />
    </div>
  )
} 