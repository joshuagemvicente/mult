import type { Product } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from "../components/ui/dropdown-menu";
import { toCurrency } from "~/utils/toCurrency";
import { Link } from "react-router"

export type ProductTableColumns = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  brand: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};


export const columns: ColumnDef<ProductTableColumns>[] = [
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "name",
  },
  {
    header: "SKU",
    accessorKey: "sku",
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "price",
    cell: ({ row }) => {
      const price = row.original.price;

      return <div className=" font-medium">{toCurrency(price)}</div>;
    },
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stock
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "stock",
    cell: ({ row }) => {
      const stock = row.original.stock
      // const stock = parseInt(row.getValue("stock"));

      return (
        <div className="">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${stock > 50
              ? "bg-green-100 text-green-800"
              : stock >= 10
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {stock}
          </span>
        </div>
      );
    },
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to={id}>
              <DropdownMenuItem>
                View
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>
              View
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu >
      )
    }
  }
];
