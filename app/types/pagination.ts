export type Pagination = {
  pageNumber?: number; // default: 1
  pageSize?: number;   // default: 10
  sortBy?: string;     // field to sort by
  sortOrder?: 'asc' | 'desc'; // sort direction
};

// For @tanstack/react-table pagination state
export interface PaginationState {
  pageIndex: number; // 0-based (pageNumber - 1)
  pageSize: number;
}

// Convert between our API pagination format and TanStack Table format
export const mapPaginationToTablePagination = (pagination: Pagination): PaginationState => {
  return {
    pageIndex: pagination.pageNumber ? pagination.pageNumber - 1 : 0,
    pageSize: pagination.pageSize || 10
  };
};

export const mapTablePaginationToPagination = (paginationState: PaginationState): Pagination => {
  return {
    pageNumber: paginationState.pageIndex + 1,
    pageSize: paginationState.pageSize
  };
}; 